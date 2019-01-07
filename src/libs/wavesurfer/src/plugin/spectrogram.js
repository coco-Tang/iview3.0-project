import * as util from '../util';

/**
 * Calculate FFT - Based on https://github.com/corbanbrook/dsp.js
 */
/* eslint-disable complexity, no-redeclare, no-var, one-var */
const FFT = function(bufferSize, sampleRate, windowFunc, alpha) {
    this.bufferSize = bufferSize;
    this.sampleRate = sampleRate;
    this.bandwidth = 2 / bufferSize * sampleRate / 2;

    this.sinTable = new Float32Array(bufferSize);
    this.cosTable = new Float32Array(bufferSize);
    this.windowValues = new Float32Array(bufferSize);
    this.reverseTable = new Uint32Array(bufferSize);

    this.peakBand = 0;
    this.peak = 0;

    switch (windowFunc) {
        case 'bartlett':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    2 /
                    (bufferSize - 1) *
                    ((bufferSize - 1) / 2 - Math.abs(i - (bufferSize - 1) / 2));
            }
            break;
        case 'bartlettHann':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    0.62 -
                    0.48 * Math.abs(i / (bufferSize - 1) - 0.5) -
                    0.38 * Math.cos(Math.PI * 2 * i / (bufferSize - 1));
            }
            break;
        case 'blackman':
            alpha = alpha || 0.16;
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    (1 - alpha) / 2 -
                    0.5 * Math.cos(Math.PI * 2 * i / (bufferSize - 1)) +
                    alpha / 2 * Math.cos(4 * Math.PI * i / (bufferSize - 1));
            }
            break;
        case 'cosine':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] = Math.cos(
                    Math.PI * i / (bufferSize - 1) - Math.PI / 2
                );
            }
            break;
        case 'gauss':
            alpha = alpha || 0.25;
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] = Math.pow(
                    Math.E,
                    -0.5 *
                        Math.pow(
                            (i - (bufferSize - 1) / 2) /
                                (alpha * (bufferSize - 1) / 2),
                            2
                        )
                );
            }
            break;
        case 'hamming':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    0.54 - 0.46 * Math.cos(Math.PI * 2 * i / (bufferSize - 1));
            }
            break;
        case 'hann':
        case undefined:
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    0.5 * (1 - Math.cos(Math.PI * 2 * i / (bufferSize - 1)));
            }
            break;
        case 'lanczoz':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    Math.sin(Math.PI * (2 * i / (bufferSize - 1) - 1)) /
                    (Math.PI * (2 * i / (bufferSize - 1) - 1));
            }
            break;
        case 'rectangular':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] = 1;
            }
            break;
        case 'triangular':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    2 /
                    bufferSize *
                    (bufferSize / 2 - Math.abs(i - (bufferSize - 1) / 2));
            }
            break;
        default:
            throw Error("No such window function '" + windowFunc + "'");
    }

    var limit = 1;
    var bit = bufferSize >> 1;

    var i;

    while (limit < bufferSize) {
        for (i = 0; i < limit; i++) {
            this.reverseTable[i + limit] = this.reverseTable[i] + bit;
        }

        limit = limit << 1;
        bit = bit >> 1;
    }

    for (i = 0; i < bufferSize; i++) {
        this.sinTable[i] = Math.sin(-Math.PI / i);
        this.cosTable[i] = Math.cos(-Math.PI / i);
    }

    this.calculateSpectrum = function(buffer) {
        // Locally scope variables for speed up
        var bufferSize = this.bufferSize,
            cosTable = this.cosTable,
            sinTable = this.sinTable,
            reverseTable = this.reverseTable,
            real = new Float32Array(bufferSize),
            imag = new Float32Array(bufferSize),
            bSi = 2 / this.bufferSize,
            sqrt = Math.sqrt,
            rval,
            ival,
            mag,
            spectrum = new Float32Array(bufferSize / 2);

        var k = Math.floor(Math.log(bufferSize) / Math.LN2);

        if (Math.pow(2, k) !== bufferSize) {
            throw 'Invalid buffer size, must be a power of 2.';
        }
        if (bufferSize !== buffer.length) {
            throw 'Supplied buffer is not the same size as defined FFT. FFT Size: ' +
                bufferSize +
                ' Buffer Size: ' +
                buffer.length;
        }

        var halfSize = 1,
            phaseShiftStepReal,
            phaseShiftStepImag,
            currentPhaseShiftReal,
            currentPhaseShiftImag,
            off,
            tr,
            ti,
            tmpReal;

        for (var i = 0; i < bufferSize; i++) {
            real[i] =
                buffer[reverseTable[i]] * this.windowValues[reverseTable[i]];
            imag[i] = 0;
        }

        while (halfSize < bufferSize) {
            phaseShiftStepReal = cosTable[halfSize];
            phaseShiftStepImag = sinTable[halfSize];

            currentPhaseShiftReal = 1;
            currentPhaseShiftImag = 0;

            for (var fftStep = 0; fftStep < halfSize; fftStep++) {
                var i = fftStep;

                while (i < bufferSize) {
                    off = i + halfSize;
                    tr =
                        currentPhaseShiftReal * real[off] -
                        currentPhaseShiftImag * imag[off];
                    ti =
                        currentPhaseShiftReal * imag[off] +
                        currentPhaseShiftImag * real[off];

                    real[off] = real[i] - tr;
                    imag[off] = imag[i] - ti;
                    real[i] += tr;
                    imag[i] += ti;

                    i += halfSize << 1;
                }

                tmpReal = currentPhaseShiftReal;
                currentPhaseShiftReal =
                    tmpReal * phaseShiftStepReal -
                    currentPhaseShiftImag * phaseShiftStepImag;
                currentPhaseShiftImag =
                    tmpReal * phaseShiftStepImag +
                    currentPhaseShiftImag * phaseShiftStepReal;
            }

            halfSize = halfSize << 1;
        }

        for (var i = 0, N = bufferSize / 2; i < N; i++) {
            rval = real[i];
            ival = imag[i];
            mag = bSi * sqrt(rval * rval + ival * ival);

            if (mag > this.peak) {
                this.peakBand = i;
                this.peak = mag;
            }
            spectrum[i] = mag;
        }
        return spectrum;
    };
};
/* eslint-enable complexity, no-redeclare, no-var, one-var */

/**
 * @typedef {Object} SpectrogramPluginParams
 * @property {string|HTMLElement} container Selector of element or element in
 * which to render
 * @property {number} fftSamples=512 number of samples to fetch to FFT. Must be
 * a pwer of 2.
 * @property {number} noverlap Size of the overlapping window. Must be <
 * fftSamples. Auto deduced from canvas size by default.
 * @property {string} windowFunc='hann' The window function to be used. One of
 * these: `'bartlett'`, `'bartlettHann'`, `'blackman'`, `'cosine'`, `'gauss'`,
 * `'hamming'`, `'hann'`, `'lanczoz'`, `'rectangular'`, `'triangular'`
 * @property {?number} alpha Some window functions have this extra value.
 * (Between 0 and 1)
 * @property {number} pixelRatio=wavesurfer.params.pixelRatio to control the
 * size of the spectrogram in relation with its canvas. 1 = Draw on the whole
 * canvas. 2 = Draw on a quarter (1/2 the length and 1/2 the width)
 * @property {?boolean} deferInit Set to true to manually call
 * `initPlugin('spectrogram')`
 */

/**
 * Render a spectrogram visualisation of the audio.
 *
 * @implements {PluginClass}
 * @extends {Observer}
 * @example
 * // es6
 * import SpectrogramPlugin from 'wavesurfer.spectrogram.js';
 *
 * // commonjs
 * var SpectrogramPlugin = require('wavesurfer.spectrogram.js');
 *
 * // if you are using <script> tags
 * var SpectrogramPlugin = window.WaveSurfer.spectrogram;
 *
 * // ... initialising wavesurfer with the plugin
 * var wavesurfer = WaveSurfer.create({
 *   // wavesurfer options ...
 *   plugins: [
 *     SpectrogramPlugin.create({
 *       // plugin options ...
 *     })
 *   ]
 * });
 */
export default class SpectrogramPlugin {
    /**
     * Spectrogram plugin definition factory
     *
     * This function must be used to create a plugin definition which can be
     * used by wavesurfer to correctly instantiate the plugin.
     *
     * @param  {SpectrogramPluginParams} params parameters use to initialise the plugin
     * @return {PluginDefinition} an object representing the plugin
     */
    static create(params) {
        return {
            name: 'spectrogram',
            deferInit: params && params.deferInit ? params.deferInit : false,
            params: params,
            staticProps: {
                FFT: FFT
            },
            instance: SpectrogramPlugin
        };
    }

    constructor(params, ws) {
        console.log('params',params);
        
        this.params = params;
        this.wavesurfer = ws;
        this.util = ws.util;

        this.frequenciesDataUrl = params.frequenciesDataUrl;
        this._onScroll = e => {
            this.updateScroll(e);
        };
        this._onReady = () => {
            const drawer = (this.drawer = ws.drawer);

            this.container =
                'string' == typeof params.container
                    ? document.querySelector(params.container)
                    : params.container;

            if (!this.container) {
                throw Error('No container for WaveSurfer spectrogram');
            }

            this.width = drawer.width;
            this.pixelRatio = this.params.pixelRatio || ws.params.pixelRatio;
            this.fftSamples =
                this.params.fftSamples || ws.params.fftSamples || 512;
            this.height = this.fftSamples / 2;
            /** 
             *1. 增加windowSamples和shiftSamples两个参数，废除noverlap
             *2. windowSamples/shiftSamples默认160/32 (20ms/4ms@8000HZ)
             *3. 增加计算过程取窗步骤 
             */
            this.windowSamples = params.windowSamples || 160;
            this.shiftSamples = params.shiftSamples || 32;
            this.noverlap = params.noverlap;
            this.windowFunc = params.windowFunc;
            this.alpha = params.alpha;

            this.createWrapper();
            this.createCanvas();
            this.render();

            drawer.wrapper.addEventListener('scroll', util.debounce((e) => {
                this._onScroll(e);
            }, 500));
            ws.on('redraw', () => this.render());
        };
    }

    init() {
        // Check if ws is ready
        if (this.wavesurfer.isReady) {
            this._onReady();
        }

        this.wavesurfer.on('ready', this._onReady);
    }

    destroy() {
        this.unAll();
        this.wavesurfer.un('ready', this._onReady);
        this.drawer.wrapper.removeEventListener('scroll', this._onScroll);
        this.wavesurfer = null;
        this.util = null;
        this.params = null;
        if (this.wrapper) {
            this.wrapper.parentNode.removeChild(this.wrapper);
            this.wrapper = null;
        }
    }

    createWrapper() {
        const prevSpectrogram = this.container.querySelector('spectrogram');
        if (prevSpectrogram) {
            this.container.removeChild(prevSpectrogram);
        }
        const wsParams = this.wavesurfer.params;
        this.wrapper = document.createElement('spectrogram');
        // if labels are active
        if (this.params.labels) {
            const labelsEl = (this.labelsEl = document.createElement('canvas'));
            labelsEl.classList.add('spec-labels');
            this.drawer.style(labelsEl, {
                left: 0,
                position: 'absolute',
                zIndex: 9,
                height: `${this.height / this.pixelRatio}px`,
                width: `${55 / this.pixelRatio}px`
            });
            this.wrapper.appendChild(labelsEl);
        }

        const handlerEl = (this.handlerEl = document.createElement('canvas'));
        handlerEl.classList.add('spec-handler');
            this.drawer.style(handlerEl, {
                right: 0,
                position: 'absolute',
                zIndex: 9,
                height: `${this.height / this.pixelRatio}px`,
                width: `${55 / this.pixelRatio}px`
            });
            this.wrapper.appendChild(handlerEl);

        this.drawer.style(this.wrapper, {
            display: 'block',
            position: 'relative',
            userSelect: 'none',
            webkitUserSelect: 'none',
            height: `${this.height / this.pixelRatio}px`
        });

        if (wsParams.fillParent || wsParams.scrollParent) {
            this.drawer.style(this.wrapper, {
                width: '100%',
                overflowX: 'hidden',
                overflowY: 'hidden'
            });
        }
        this.container.appendChild(this.wrapper);

        this.wrapper.addEventListener('click', e => {
            e.preventDefault();
            const relX = 'offsetX' in e ? e.offsetX : e.layerX;
            this.fireEvent('click', relX / this.scrollWidth || 0);
        });
    }

    createCanvas() {
        const canvas = (this.canvas = this.wrapper.appendChild(
            document.createElement('canvas')
        ));

        this.spectrCc = canvas.getContext('2d');

        this.util.style(canvas, {
            position: 'absolute',
            zIndex: 4
        });
    }

    render() {
        this.updateCanvasStyle();

        if (this.frequenciesDataUrl) {
            this.loadFrequenciesData(this.frequenciesDataUrl);
        } else {
            this.getFrequencies(this.drawSpectrogram);
        }
        if (this.params.labels) {
            // can be customized in next version
            this.loadLabels(
                'rgba(68,68,68,0.5)',
                '12px',
                '10px',
                '',
                '#fff',
                '#f7f7f7',
                'center',
                '#specLabels'
            );
        }
        this.loadHandler(
            'rgba(68,68,68,0.5)',
            '12px',
            '10px',
            '',
            '#fff',
            '#f7f7f7',
            'center',
            '#specHandler'
        );
    }

    updateCanvasStyle() {
        const width = Math.round(this.width / this.pixelRatio) + 'px';
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = width;
    }

    // grey2color(greyColor) {
    //     let blueColor, greenColor, redColor;
    //     if (greyColor <= 51)
    //     {
    //        blueColor = 255;
    //        greenColor = greyColor*5;
    //        redColor = 0;
    //     }
    //     else if (greyColor <= 102)
    //     {
    //        greyColor-=51;
    //        blueColor = 255-greyColor*5;
    //        greenColor = 255;
    //        redColor = 0;
    //     }
    //     else if (greyColor <= 153)
    //     {
    //         greyColor-=102;
    //         blueColor = 0;
    //        greenColor = 255;
    //        redColor = greyColor*5;
    //     }
    //     else if (greyColor <= 204)
    //     {
    //        greyColor-=153;
    //        blueColor = 0;
    //        greenColor = 255-(128.0*greyColor/51.0+0.5);
    //        redColor = 255;
    //     }
    //     else
    //     {
    //        greyColor-=204;
    //        blueColor = 0;
    //        greenColor = 127-(127.0*greyColor/51.0+0.5);
    //        redColor = 255;
    //     }
    //     return {blueColor: ~~blueColor, greenColor: ~~greenColor, redColor: ~~redColor};
    // }

    drawSpectrogram(frequenciesData, my) {
        const spectrCc = my.spectrCc;
        //const length = my.wavesurfer.backend.getDuration();
        const height = my.height;
        const pixels = my.resample(frequenciesData);
        //const heightFactor = my.buffer ? 2 / my.buffer.numberOfChannels : 1;
        let i;
        let j;

        for (i = 0; i < pixels.length; i++) {
            for (j = 0; j < pixels[i].length; j++) {
                const colorValue = 255 - pixels[i][j];
                // const {blueColor, greenColor, redColor} = my.grey2color(colorValue);
                my.spectrCc.fillStyle =
                    'rgb(' +
                    colorValue +
                    ', ' +
                    colorValue +
                    ', ' +
                    colorValue +
                    ')';
                my.spectrCc.fillRect(
                    i,
                    height - j,
                    1,
                    1
                );
            }
        }
    }

    getFrequencies(callback) {
        const fftSamples = this.fftSamples;
        const buffer = (this.buffer = this.wavesurfer.backend.buffer);
        const channelOne = buffer.getChannelData(0);
        //const bufferLength = buffer.length;
        const sampleRate = buffer.sampleRate;
        const frequencies = [];

        if (!buffer) {
            this.fireEvent('error', 'Web Audio buffer is not available');
            return;
        }

        let noverlap = this.noverlap;
        if (!noverlap) {
            //const uniqueSamplesPerPx = buffer.length / this.canvas.width;
            //noverlap = Math.max(0, Math.round(fftSamples - uniqueSamplesPerPx));
            const hopSamples = sampleRate / 1000 * 4; // 4ms, broadband spetrogram
            noverlap = Math.max(0, fftSamples - hopSamples)
        }

        const fft = new FFT(
            fftSamples,
            sampleRate,
            this.windowFunc || 'gauss', // praat uses gauss window
            this.alpha
        );

        //const maxSlicesCount = Math.floor(
        //    bufferLength / (fftSamples - noverlap)
        //);
        const offset = this.wavesurfer.getWindowOffset();
        const length = this.wavesurfer.getWindowLength();

        let currentOffset = ~~(offset * sampleRate);
        let currentLength = ~~(Math.min(channelOne.length, currentOffset + length * sampleRate));

        console.log("offset: " + currentOffset + " length: " + currentLength);

        let windowSamples = Math.min(this.windowSamples, fftSamples);
        let shiftSamples = this.shiftSamples;

        if (this.params.flag) {
            while (currentOffset +  fftSamples < currentLength) {
                const segment = channelOne.slice(
                    currentOffset,
                    currentOffset + fftSamples
                );
                if (windowSamples < fftSamples) {
                    segment.fill(0, windowSamples, fftSamples);
                }
                const spectrum = fft.calculateSpectrum(segment);
                const array = new Uint8Array(fftSamples / 2);
                let j;
                for (j = 0; j < fftSamples / 2; j++) {
                    array[j] = Math.max(-255, Math.log10(spectrum[j]) * 45);
                }
                frequencies.push(array);
                currentOffset += shiftSamples;
            }
        } else {
            while (currentOffset + fftSamples < currentLength) {
                const segment = channelOne.slice(
                    currentOffset,
                    currentOffset + fftSamples
                );
                const spectrum = fft.calculateSpectrum(segment);
                const array = new Uint8Array(fftSamples / 2);
                let j;
                for (j = 0; j < fftSamples / 2; j++) {
                    array[j] = Math.max(-255, Math.log10(spectrum[j]) * 45);
                }
                frequencies.push(array);
                currentOffset += fftSamples - noverlap;
            }

        }

        
        callback(frequencies, this);
    }

    loadFrequenciesData(url) {
        const ajax = this.util.ajax({ url: url });

        ajax.on('success', data =>
            this.drawSpectrogram(JSON.parse(data), this)
        );
        ajax.on('error', e =>
            this.fireEvent('error', 'XHR error: ' + e.target.statusText)
        );

        return ajax;
    }

    freqType(freq) {
        return freq >= 1000 ? (freq / 1000).toFixed(1) : Math.round(freq);
    }

    unitType(freq) {
        return freq >= 1000 ? 'KHz' : 'Hz';
    }

    loadLabels(
        bgFill,
        fontSizeFreq,
        fontSizeUnit,
        fontType,
        textColorFreq,
        textColorUnit,
        textAlign,
        container
    ) {
        const frequenciesHeight = this.height;
        bgFill = bgFill || 'rgba(68,68,68,0)';
        fontSizeFreq = fontSizeFreq || '12px';
        fontSizeUnit = fontSizeUnit || '10px';
        fontType = fontType || 'Helvetica';
        textColorFreq = textColorFreq || '#fff';
        textColorUnit = textColorUnit || '#fff';
        textAlign = textAlign || 'center';
        container = container || '#specLabels';
        const getMaxY = frequenciesHeight || 512;
        const labelIndex = 5 * (getMaxY / 256);
        const freqStart = 0;
        const step =
            (this.buffer.sampleRate / 2 - freqStart) /
            labelIndex;

        const ctx = this.labelsEl.getContext('2d');
        this.labelsEl.height = this.height;
        this.labelsEl.width = 55;

        ctx.fillStyle = bgFill;
        ctx.fillRect(0, 0, 55, getMaxY);
        ctx.fill();
        let i;

        for (i = 0; i <= labelIndex; i++) {
            ctx.textAlign = textAlign;
            ctx.textBaseline = 'middle';

            const freq = freqStart + step * i;
            const index = Math.round(
                freq / (this.sampleRate / 2) * this.fftSamples
            );
            const label = this.freqType(freq);
            const units = this.unitType(freq);
            const x = 16;
            const yLabelOffset = 2;

            if (i == 0) {
                ctx.fillStyle = textColorUnit;
                ctx.font = fontSizeUnit + ' ' + fontType;
                ctx.fillText(units, x + 24, getMaxY + i - 10);
                ctx.fillStyle = textColorFreq;
                ctx.font = fontSizeFreq + ' ' + fontType;
                ctx.fillText(label, x, getMaxY + i - 10);
            } else {
                ctx.fillStyle = textColorUnit;
                ctx.font = fontSizeUnit + ' ' + fontType;
                ctx.fillText(units, x + 24, getMaxY - i * 50 + yLabelOffset);
                ctx.fillStyle = textColorFreq;
                ctx.font = fontSizeFreq + ' ' + fontType;
                ctx.fillText(label, x, getMaxY - i * 50 + yLabelOffset);
            }
        }
    }

    loadHandler(
        bgFill,
        fontSizeFreq,
        fontSizeUnit,
        fontType,
        textColorFreq,
        textColorUnit,
        textAlign,
        container
    ) {
        const frequenciesHeight = this.height;
        bgFill = bgFill || 'rgba(68,68,68,0)';
        fontSizeFreq = fontSizeFreq || '12px';
        fontSizeUnit = fontSizeUnit || '10px';
        fontType = fontType || 'Helvetica';
        textColorFreq = textColorFreq || '#fff';
        textColorUnit = textColorUnit || '#fff';
        textAlign = textAlign || 'center';
        container = container || '#specHandler';
        const getMaxY = frequenciesHeight || 512;
        const labelIndex = 5 * (getMaxY / 256);
        const freqStart = 0;
        const step =
            (this.buffer.sampleRate / 2 - freqStart) /
            labelIndex;

        const ctx = this.handlerEl.getContext('2d');
        this.handlerEl.height = this.height;
        this.handlerEl.width = 55;

        ctx.fillStyle = bgFill;
        ctx.fillRect(0, 0, 55, getMaxY);
        ctx.fill();
        let i;

        for (i = 0; i <= labelIndex; i++) {
            ctx.textAlign = textAlign;
            ctx.textBaseline = 'middle';

            const freq = freqStart + step * i;
            const index = Math.round(
                freq / (this.sampleRate / 2) * this.fftSamples
            );
            const label = this.freqType(freq);
            const units = this.unitType(freq);
            const x = 16;
            const yLabelOffset = 2;

            if (i == 0) {
                ctx.fillStyle = textColorUnit;
                ctx.font = fontSizeUnit + ' ' + fontType;
                ctx.fillText(units, x + 24, getMaxY + i - 10);
                ctx.fillStyle = textColorFreq;
                ctx.font = fontSizeFreq + ' ' + fontType;
                ctx.fillText(label, x, getMaxY + i - 10);
            } else {
                ctx.fillStyle = textColorUnit;
                ctx.font = fontSizeUnit + ' ' + fontType;
                ctx.fillText(units, x + 24, getMaxY - i * 50 + yLabelOffset);
                ctx.fillStyle = textColorFreq;
                ctx.font = fontSizeFreq + ' ' + fontType;
                ctx.fillText(label, x, getMaxY - i * 50 + yLabelOffset);
            }
        }
    }

    updateScroll(e) {
        if (this.wrapper) {
            this.wrapper.scrollLeft = e.target.scrollLeft;
        }
        this.render();
    }

    resample(oldMatrix) {
        const columnsNumber = this.width;
        const newMatrix = [];

        const oldPiece = 1 / oldMatrix.length;
        const newPiece = 1 / columnsNumber;
        let i;

        for (i = 0; i < columnsNumber; i++) {
            const column = new Array(oldMatrix[0].length);
            let j;

            for (j = 0; j < oldMatrix.length; j++) {
                const oldStart = j * oldPiece;
                const oldEnd = oldStart + oldPiece;
                const newStart = i * newPiece;
                const newEnd = newStart + newPiece;

                const overlap =
                    oldEnd <= newStart || newEnd <= oldStart
                        ? 0
                        : Math.min(
                              Math.max(oldEnd, newStart),
                              Math.max(newEnd, oldStart)
                          ) -
                          Math.max(
                              Math.min(oldEnd, newStart),
                              Math.min(newEnd, oldStart)
                          );
                let k;
                /* eslint-disable max-depth */
                if (overlap > 0) {
                    for (k = 0; k < oldMatrix[0].length; k++) {
                        if (column[k] == null) {
                            column[k] = 0;
                        }
                        column[k] += overlap / newPiece * oldMatrix[j][k];
                    }
                }
                /* eslint-enable max-depth */
            }

            const intColumn = new Uint8Array(oldMatrix[0].length);
            let m;

            for (m = 0; m < oldMatrix[0].length; m++) {
                intColumn[m] = column[m];
            }

            newMatrix.push(intColumn);
        }

        return newMatrix;
    }
}
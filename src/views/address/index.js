import { province } from "@/utils/address/province.js";
import { city } from "@/utils/address/city.js";
import { area } from "@/utils/address/area.js";
// console.log('');
let cityData = Object.values(city).map(item => {
    // console.log(item[0]);
    return {
        value: item[0].id,
        label: item[0].province,
        children: item.map(el => {
            // console.log(el);
            return {
                value: el.id,
                label: el.name,
                children: Object.values(area).map(item => {
                    // console.log(item)
                    return {
                        value: item[0],
                        label: item.name,
                    }
                })
            }
        })
    }
})

// console.log(cityData)
console.log(Object.values(area))
export { cityData }

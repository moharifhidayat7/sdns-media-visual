import { useRouter } from "next/router";

export function inputNumberOnly(e) {
   if (e.target.value.match(/[^0-9]/g)) {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
   }
}
// generate code with prefix 0000 and params value
export function generateCode(prefix, value) {
   let code = prefix + "";
   for (let i = 0; i < 5 - value.toString().length; i++) {
      code += "0";
   }
   return code + value;
}


import { useRouter } from "next/router";

// fotmate date to local string
export function formatDate(date, type = "default") {
   if (type == "default") {
      return new Date(date).toLocaleString("id-ID", {
         month: "long",
         year: "numeric",
         day: "2-digit",
      });
   }
}
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


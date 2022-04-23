import {
  useRouter
} from "next/router";

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
//convert number to rupiah  format
export function convertToRupiah(angka) {
  let rupiah = "";
  let angkarev = angka
    .toString()
    .split("")
    .reverse()
    .join("");
  for (let i = 0; i < angkarev.length; i++)
    if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ".";
  let hasil =
    rupiah.split("", rupiah.length - 1)
    .reverse()
    .join("");
  return hasil + ",-";
}
export function generateString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
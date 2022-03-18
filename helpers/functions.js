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
//get title from router pathname
export function getTitle() {
   const router = useRouter();
   const title = router.pathname.split("/").slice(-1)[0];
   return title;
}

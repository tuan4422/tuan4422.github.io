const themeBtn=document.getElementById("themeBtn");
const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");
const topBtn=document.getElementById("topBtn");

if(localStorage.getItem("theme")==="light"){
  document.body.classList.add("light");
  themeBtn.textContent="☀";
}

themeBtn.addEventListener("click",()=>{
  document.body.classList.toggle("light");
  const light=document.body.classList.contains("light");
  themeBtn.textContent=light?"☀":"☾";
  localStorage.setItem("theme",light?"light":"dark");
});

menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("show")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

window.addEventListener("scroll",()=>{
  topBtn.style.display=window.scrollY>500?"block":"none";
});
topBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

document.getElementById("year").textContent=new Date().getFullYear();

document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  document.getElementById("formMessage").textContent="Đã nhận thông tin! (Demo — chưa kết nối email)";
  e.target.reset();
});

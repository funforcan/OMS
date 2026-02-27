"use strict"; 

const body = document.body;
const bgColorsBody = ["#00ABCC", "#00ABCC", "#00ABCC", "#00ABCC", "#00ABCC"];
const menu = body.querySelector(".menu");
const menuItems = menu.querySelectorAll(".menu__item");
const menuBorder = menu.querySelector(".menu__border");
let activeItem = menu.querySelector(".active");
const topArea = document.getElementById("top-area");

function clickItem(item, index) {
    const currentUser = localStorage.getItem("user");
    if (!currentUser && index !== 0) {
        const errorDiv = document.getElementById("error");
        if (errorDiv) errorDiv.innerText = "Lütfen önce giriş yapın!";
        return; 
    }

    menu.style.removeProperty("--timeOut");
    if (activeItem == item) return;
    
    if (activeItem) activeItem.classList.remove("active");
    item.classList.add("active");

    const pages = document.querySelectorAll('.tab-page');
    pages.forEach(p => p.classList.remove('active-page'));
    if(pages[index]) pages[index].classList.add('active-page');

    if (index === 1 && typeof renderUserPanel === "function") { renderUserPanel(); renderLogs(); }
    if (index === 2 && typeof loadBasketData === "function") { loadBasketData(); }
    if (index === 4 && typeof startSocialMode === "function") { startSocialMode(); }

    topArea.style.backgroundColor = bgColorsBody[index];
    activeItem = item;
    offsetMenuBorder(activeItem, menuBorder);
}

function offsetMenuBorder(element, menuBorder) {
    const offsetActiveItem = element.getBoundingClientRect();
    const left = Math.floor(offsetActiveItem.left - menu.offsetLeft - (menuBorder.offsetWidth  - offsetActiveItem.width) / 2) +  "px";
    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`;
}

offsetMenuBorder(activeItem, menuBorder);

menuItems.forEach((item, index) => {
    item.addEventListener("click", () => clickItem(item, index));
});

window.addEventListener("resize", () => {
    offsetMenuBorder(activeItem, menuBorder);
    menu.style.setProperty("--timeOut", "none");
});

async function checkUserStatus() {
    const user = localStorage.getItem("user");
    if (!user) return;

    try {
        const res = await fetch(`${baseDbUrl}/UserList/${user}.json`);
        const userData = await res.json();
        const overlay = document.getElementById("access-denied-overlay");

        // Eğer userStatu false ise veya kullanıcı veritabanından silinmişse
        if (userData && userData.userStatu === false) {
            overlay.style.display = "flex";
            
            // Diğer sekmelere geçişi engellemek için anasayfaya zorla
            const pages = document.querySelectorAll('.tab-page');
            pages.forEach((p, idx) => {
                if(idx === 0) p.classList.add('active-page');
                else p.classList.remove('active-page');
            });
            
            // Menü seçimini de ilk sıraya çek
            const menuItems = document.querySelectorAll(".menu__item");
            if(menuItems.length > 0) clickItem(menuItems[0], 0);

        } else {
            overlay.style.display = "none";
        }
    } catch (err) {
        console.error("Durum kontrol hatası:", err);
    }
}

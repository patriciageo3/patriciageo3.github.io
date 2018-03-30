
const hashLinks = document.querySelectorAll("a[href^='#']");
const navLinks = Array.from(document.getElementsByClassName("nav-link"));
const brkPoints = Array.from(document.getElementsByClassName('breakpoint'));
let scrollDistances = [];
let navHeight = document.getElementsByClassName("fixed-top")[0].offsetHeight; 
navLinks[0].classList.add("active");

function distanceToTop(elem) {
    return Math.floor(elem.getBoundingClientRect().top);
}

function smoothScroll(e) {
    e.preventDefault();
    let targetId = this.getAttribute("href");
    let targetSection = document.querySelector(targetId);
    if (!targetSection) return;
    
    let toTop = distanceToTop(targetSection);
    window.scrollBy({ top: toTop, left: 0, behavior: "smooth" });

    let checkIfDone = setInterval(function() {
        let reachedBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
        if (distanceToTop(targetSection) === 0 || reachedBottom) {
            targetSection.tabIndex = "-1";
            targetSection.focus();
            window.history.pushState("", "", targetId);
            clearInterval(checkIfDone);
        }
    }, 100);
}

function getDistanceFromDocumentTop(elem) {
        var location = 0;
        if (elem.offsetParent) {
            do {
                location += elem.offsetTop;
                elem = elem.offsetParent;
            } while (elem);
        }
        return location >= 0 ? location : 0;
}; 

function getBreakpoints() {
    brkPoints.forEach(elem => {
        let targetId = elem.id;
        let distance = getDistanceFromDocumentTop(elem);
        let obj = {};
        obj.id = targetId;
        obj.position = distance;
        scrollDistances.push(obj);
    });
}

getBreakpoints();

function cleanUpMenu() {
    navLinks.forEach(elem => {
        if (elem.classList.contains("active")) {
            elem.classList.remove("active");
        }
    }); 
}

function activateMenuOnScroll() {
    let scrollDistance = window.pageYOffset;
    let scrollLength = scrollDistance + window.innerHeight;
    let totalHeight = document.body.offsetHeight;
    
    cleanUpMenu();
    
    if (scrollDistance < scrollDistances[0].position - navHeight) {
        //Activate Home in menu when scrolled
        navLinks[0].classList.add("active");
        return;
    } else if (scrollLength >= totalHeight) {
        //Activate HireMe! in menu when scrolled
        navLinks[navLinks.length - 1].classList.add("active");
        return;
    }
    
    scrollDistances.forEach(elem => {
        if (scrollDistance >= elem.position - navHeight) {
            cleanUpMenu();
            
            let currentLink = "#" + elem.id;
            let currentNavElem = navLinks.find(x => x.getAttribute("href") === currentLink);
            currentNavElem.classList.add("active");
        }
    });
}

hashLinks.forEach(linkElem => {
    //for the two carousel buttons (right/ left), it should not scroll anywhere when user clicks on them
    if (linkElem.getAttribute("href") === "#PGCarousel") return;
    linkElem.addEventListener("click", smoothScroll);
});
document.addEventListener("scroll", activateMenuOnScroll);
window.addEventListener("resize", function() {
    getBreakpoints();
});


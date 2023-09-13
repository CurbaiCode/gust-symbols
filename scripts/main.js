var dms = document.getElementsByClassName("darkmode");
var fs = document.getElementsByClassName("fill");

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(e) {
    var storedTheme = localStorage.getItem("theme") || (e.matches ? "dark" : "light");
    if (storedTheme) {
        document.body.setAttribute("data-theme", storedTheme);
        for (var i = 0; i < dms.length; i++) {
            dms[i].checked = (storedTheme == "dark") ? true : false;
        }
    }
})

var items = document.getElementById("list").children;
document.getElementById("count").textContent = `${Math.floor((items.length - 1) / 10) * 10}+ s`;

var sidebar = document.getElementById("sidebar");
var sticky = sidebar.offsetTop;
window.onscroll = function() {
    var label = document.getElementById("sidebar-label");
    if (window.pageYOffset >= sticky - 16) {
        sidebar.classList.add("sticky");
        label.classList.add("show");
    } else {
        sidebar.classList.remove("sticky");
        label.classList.remove("show");
    }
};

function getSymbolName() {
    var name = location.pathname.slice(1);
    if (name) {
        if (name.endsWith("/")) {
            name = name.slice(0, -1);
        }
        return name;
    }
}

var list = [];
function load() {
    var i;
    for (i = 0; i < items.length; i++) {
        var el = items[i];
        var name = el.getElementsByTagName("i")[0].textContent;
        if (el.childElementCount != 2) {
            var p = document.createElement("p");
            p.innerHTML = name;
            el.appendChild(p);
        } else {
            el.getElementsByTagName("p")[0].textContent = name;
        }
    }
    var selected = getSymbolName();
    if (selected) {
        var btn;
        for (i = 0; i < items.length; i++) {
            var name = items[i].getElementsByTagName("i")[0].textContent;
            if (name == selected) {
                btn = items[i];
            }
        }
        if (btn) {
            present(btn);
        }
    }
    list = [].slice.call(items).map(function(el) { return { text: el.getElementsByTagName("p")[0].textContent, element: el } });
}

function fill(s) {
    if (s.dataset.alt) {
        var os = s.textContent;
        s.textContent = s.dataset.alt;
        s.dataset.alt = os;
    }
    load();
    search();
}

function toggle(s) {
    var i;
    if (s.classList.contains("darkmode")) {
        if (s.checked) {
            var targetTheme = "dark";
        } else {
            var targetTheme = "light";
        }
        for (i = 0; i < dms.length; i++) {
            dms[i].checked = s.checked;
        }
        document.body.setAttribute("data-theme", targetTheme);
        localStorage.setItem("theme", targetTheme);
    } else if (s.classList.contains("fill")) {
        for (i = 0; i < fs.length; i++) {
            fs[i].checked = s.checked;
        }
        for (i = 0; i < items.length; i++) {
            fill(items[i].getElementsByTagName("i")[0]);
        }
        fill(document.getElementById("display").getElementsByTagName("i")[0]);
        var name = document.getElementById("display").getElementsByTagName("i")[0].textContent;
        document.getElementById("title-text").textContent = name;
        document.getElementById("download").href = document.getElementById("download").href.replace(/([^\/]+)(?=\.\w+$)/, name);
        var codes = document.getElementsByClassName("codename");
        for (var i = 0; i < codes.length; i++) {
            codes[i].textContent = name;
        }
    } else if (s.id == "small") {
        var list = document.getElementById("list");
        if (s.checked) {
            list.classList.add("small");
        } else {
            list.classList.remove("small");
        }
        Gust();
    }
}

function filter(btn, type) {
    document.getElementsByClassName("active")[0].classList.remove("active");
    btn.classList.add("active");
    var i;
    if (type == "all") {
        for (i = 0; i < items.length; i++) {
            items[i].classList.remove("hide");
        }
    } else {
        for (i = 0; i < items.length; i++) {
            var el = items[i];
            if (!el.classList.contains(type)) {
                el.classList.add("hide");
            } else {
                el.classList.remove("hide");
            }
        }
    }
}

function tab(el, tabName) {
    var i, x, tabs, open;
    x = document.getElementsByClassName("tab-content");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tabs = document.getElementsByClassName("tab");
    open = document.getElementsByClassName("open");
    for (i = 0; i < open.length; i++) {
        open[i].classList.remove("open");
    }
    document.getElementById(tabName).style.display = "block";
    el.classList.add("open");
}

window.onpopstate = function(e) {
    if (e.state == "Home") {
        dismiss();
    } else {
        load();
    }
};

var modal = document.getElementById("modal");
function present(btn) {
    var name = btn.getElementsByTagName("p")[0].textContent;
    document.getElementById("title-text").textContent = name;
    document.getElementById("display").innerHTML = btn.getElementsByTagName("i")[0].outerHTML;
    document.getElementById("download").href = `/Gust-Symbols/${(btn.classList) ? btn.classList : ""}/${name}.svg`;
    var notice = document.getElementById("notice");
    if (btn.title) {
        document.getElementById("d-title").textContent = btn.title;
        notice.style.display = "block";
    } else {
        notice.style.display = "none";
    }
    var codes = document.getElementsByClassName("codename");
    for (var i = 0; i < codes.length; i++) {
        codes[i].textContent = name;
    }
    modal.style.display = "block";
    var newTitle = `${name} | Gust Symbols`;
    document.title = newTitle;
    window.history.pushState(name, newTitle, `/Gust-Symbols/${name}/`);
    Gust();
}

function dismiss() {
    modal.style.display = "none";
    document.getElementById("disclaimer").classList.add("inactive");
    document.getElementById("reveal").classList.add("inactive");
    document.title = "Gust Symbols";
    window.history.pushState("Home", "Gust Symbols", "/Gust-Symbols/");
}

window.onclick = function(event) {
    if (event.target == modal) {
        dismiss();
    }
}

function disclaimer() {
    document.getElementById("disclaimer").classList.remove("inactive");
    document.getElementById("reveal").classList.remove("inactive");
}

function copyMain(txt) {
    var tmp = document.createElement("textarea");
    document.body.appendChild(tmp);
    tmp.value = txt;
    tmp.select();
    tmp.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    document.body.removeChild(tmp);
}

function copy(el) {
    copyMain(el.textContent);
}

function copyURL() {
    copyMain(location.href);
}

var input = document.getElementById("search-input");
function search() {
    var i, x;
    var clear = document.getElementById("clear");
    if (input.value) {
        input.style.width = "calc(100% - 96px)";
        clear.style.display = "inline-block";
        Gust();
        let uf = new uFuzzy({});
        let idxs = uf.search(list.map(function(el) { return el.text }), input.value);
        if (idxs != null && idxs.length > 0) {
            for (i = 0; i < items.length; i++) {
                x = items[i];
                x.classList.add("filter");
                x.style.order = "";
            }
            for (i = 0; i < idxs.length; i++) {
                try {
                    x = list[idxs[0][i]].element;
                    x.classList.remove("filter");
                    x.style.order = idxs[2][i];
                } catch { }
            }
        }
    } else {
        clear.style.display = "none";
        input.style.width = "calc(100% - 48px)";
        for (i = 0; i < items.length; i++) {
            x = items[i];
            x.classList.remove("filter");
            x.style.order = "";
        }
    }
}

function clearSearch() {
    input.value = "";
    search();
}

function setColor(ci) {
    document.body.style.setProperty("--primary", ci.value);
}

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================================================
       CREATE DYNAMIC TOP LOADING BAR (SIMULATES REAL PAGE LOADS)
       ========================================================================== */
    const loadingBar = document.createElement("div");
    loadingBar.id = "globalPageLoader";
    loadingBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3.5px;
        width: 0%;
        background-color: #d40511;
        z-index: 99999;
        transition: width 2.2s cubic-bezier(0.1, 0.5, 0.3, 1), opacity 0.3s ease;
        box-shadow: 0 0 10px rgba(212, 5, 17, 0.8);
    `;
    document.body.appendChild(loadingBar);

    /* ==========================================================================
       PACKAGE DATA REGISTRY (ONLY THESE TRACKING NUMBERS WILL BE VALID)
       ========================================================================== */
    const shipmentDatabase = {
        "SOS123456": {
            status: "In Transit",
            estimatedDelivery: "Sept 12, 2026",
            origin: "Berlin, Germany",
            destination: "Lagos, Nigeria",
            history: [
                { location: "Lagos Central Hub, Nigeria", date: "Sept 08, 2026 - 10:30 AM", detail: "Arrived at Sort Facility" },
                { location: "Frankfurt Transit Center, Germany", date: "Sept 06, 2026 - 04:15 PM", detail: "Departed Facility" },
                { location: "Berlin Service Point, Germany", date: "Sept 05, 2026 - 09:00 AM", detail: "Shipment Picked Up" }
            ]
        },
        "EXPRESS99": {
            status: "Delivered",
            estimatedDelivery: "Delivered on Sept 07, 2026",
            origin: "London, UK",
            destination: "Abuja, Nigeria",
            history: [
                { location: "Abuja Regional Hub, Nigeria", date: "Sept 07, 2026 - 02:00 PM", detail: "Delivered & Signed" },
                { location: "London Gateway, UK", date: "Sept 04, 2026 - 11:00 AM", detail: "Processed at Export Facility" }
            ]
        }
    };

    /* ==========================================================================
       1. GLOBAL NAVIGATION VIEW SWAPPING SYSTEM WITH EXTENDED PAGE LOAD
       ========================================================================== */
    const views = {
        home: document.getElementById("homepagePrimaryView"),
        track: document.getElementById("trackTraceView"),
        cs: document.getElementById("customerServiceView"),
        contact: document.getElementById("findContactView"),
        business: document.getElementById("shipoverseasBusinessView"),
        form: document.getElementById("shipoverseasEcommerceFormView"),
        success: document.getElementById("ecommerceSuccessView"),
        results: document.getElementById("trackingResultsView"),
        locator: document.getElementById("locatorView"),
        portals: document.getElementById("portalsView"),
        partnerships: document.getElementById("brandPartnershipsView")
    };

    let isNavigating = false;

    function switchView(targetViewKey) {
        if (isNavigating) return;
        isNavigating = true;

        document.body.style.cursor = "wait";

        loadingBar.style.transition = "none";
        loadingBar.style.width = "0%";
        loadingBar.style.opacity = "1";

        void loadingBar.offsetWidth;

        loadingBar.style.transition = "width 2.2s cubic-bezier(0.1, 0.5, 0.3, 1), opacity 0.3s ease";
        loadingBar.style.width = "90%";

        setTimeout(() => {
            Object.values(views).forEach(view => {
                if (view) view.classList.add("hidden-view");
            });

            if (views[targetViewKey]) {
                views[targetViewKey].classList.remove("hidden-view");
                window.scrollTo({ top: 0, behavior: "instant" });
            }

            loadingBar.style.transition = "width 0.2s ease";
            loadingBar.style.width = "100%";

            setTimeout(() => {
                loadingBar.style.opacity = "0";
                document.body.style.cursor = "default";
                isNavigating = false;

                setTimeout(() => {
                    loadingBar.style.width = "0%";
                }, 300);
            }, 200);

        }, 2400);
    }

    /* ==========================================================================
       2. STRICT TRACKING SEARCH & RENDER ENGINE (VALID vs INVALID CHECK)
       ========================================================================== */
    function processTrackingSearch(trackingId) {
        const cleanId = trackingId.trim().toUpperCase();
        const data = shipmentDatabase[cleanId];

        const resultTrackingId = document.getElementById("resultTrackingId");
        const resultStatus = document.getElementById("resultStatus");
        const resultEstDelivery = document.getElementById("resultEstDelivery");
        const resultOrigin = document.getElementById("resultOrigin");
        const resultDestination = document.getElementById("resultDestination");
        const timelineContainer = document.getElementById("timelineContainer");

        if (data) {
            if (resultTrackingId) resultTrackingId.textContent = `Tracking Number: ${cleanId}`;
            if (resultStatus) {
                resultStatus.textContent = data.status;
                resultStatus.style.color = "#d40511";
            }
            if (resultEstDelivery) resultEstDelivery.textContent = `Est. Delivery: ${data.estimatedDelivery}`;
            if (resultOrigin) resultOrigin.textContent = data.origin;
            if (resultDestination) resultDestination.textContent = data.destination;

            if (timelineContainer) {
                timelineContainer.innerHTML = data.history.map((event, index) => `
                    <div style="position: relative;">
                        <div style="position: absolute; left: -23px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background-color: ${index === 0 ? '#d40511' : '#aaaaaa'};"></div>
                        <strong style="font-size: 15px; color: #111;">${event.location}</strong>
                        <p style="font-size: 13px; color: #555; margin: 2px 0;">${event.detail}</p>
                        <span style="font-size: 11px; color: #888;">${event.date}</span>
                    </div>
                `).join("");
            }
        } else {
            if (resultTrackingId) resultTrackingId.textContent = `Tracking Number: ${cleanId}`;
            if (resultStatus) {
                resultStatus.textContent = "Invalid Tracking Number";
                resultStatus.style.color = "#cc0000";
            }
            if (resultEstDelivery) resultEstDelivery.textContent = "Status: Not Found";
            if (resultOrigin) resultOrigin.textContent = "N/A";
            if (resultDestination) resultDestination.textContent = "N/A";

            if (timelineContainer) {
                timelineContainer.innerHTML = `
                    <div style="padding: 16px; background-color: #fff5f5; border: 1px solid #ffcccc; border-radius: 6px; color: #d40511;">
                        <strong style="font-size: 16px; display: block; margin-bottom: 6px;">No shipment found</strong>
                        <p style="font-size: 13px; color: #444; margin: 0;">
                            We could not find any shipment matching <strong>"${cleanId}"</strong>. Please check your tracking number and try again.
                        </p>
                    </div>
                `;
            }
        }

        switchView("results");
    }

    document.querySelectorAll(".track-form, .cs-search-form").forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const input = this.querySelector("input[type='text']");
            if (input && input.value.trim() !== "") {
                processTrackingSearch(input.value);
            }
        });
    });

    /* ==========================================================================
       3. FULL SCREEN MOBILE DRAWER OVERLAY ANIMATIONS & MODALS
       ========================================================================== */
    const menuToggle = document.getElementById("menuToggle");
    const closeMenu = document.getElementById("closeMenu");
    const fullOverlayMenu = document.getElementById("fullOverlayMenu");

    if (menuToggle && fullOverlayMenu) {
        menuToggle.addEventListener("click", () => {
            fullOverlayMenu.classList.add("menu-active");
        });
    }

    if (closeMenu && fullOverlayMenu) {
        closeMenu.addEventListener("click", () => {
            fullOverlayMenu.classList.remove("menu-active");
        });
    }

    const drawerTrackBtn = document.getElementById("drawerTrackBtn");
    if (drawerTrackBtn) {
        drawerTrackBtn.addEventListener("click", () => {
            fullOverlayMenu.classList.remove("menu-active");
            switchView("track");
        });
    }

    const menuCustomerServiceBtn = document.getElementById("menuCustomerServiceBtn");
    if (menuCustomerServiceBtn) {
        menuCustomerServiceBtn.addEventListener("click", (e) => {
            e.preventDefault();
            fullOverlayMenu.classList.remove("menu-active");
            switchView("cs");
        });
    }

    const headerLogoBtn = document.getElementById("headerLogoBtn");
    if (headerLogoBtn) {
        headerLogoBtn.addEventListener("click", () => {
            switchView("home");
        });
    }

    // --- AUTO GEOLOCATION & LOCATION SWITCHER ---
    const currentCountryCode = document.getElementById("currentCountryCode");
    const currentFlagBadge = document.getElementById("currentFlagBadge");
    const drawerLocationBtn = document.getElementById("drawerLocationBtn");
    const locationModalOverlay = document.getElementById("locationModalOverlay");
    const closeLocationModal = document.getElementById("closeLocationModal");
    const countryListOptions = document.getElementById("countryListOptions");
    const countrySearchInput = document.getElementById("countrySearchInput");

    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
            if (data && data.country_code) {
                setCountry(data.country_code, getFlagEmoji(data.country_code));
            }
        })
        .catch(() => {
            setCountry("NG", "🇳🇬");
        });

    function setCountry(code, flag) {
        if (currentCountryCode) currentCountryCode.textContent = `(${code})`;
        if (currentFlagBadge) currentFlagBadge.textContent = flag;
    }

    function getFlagEmoji(countryCode) {
        return countryCode.toUpperCase().replace(/./g, char => 
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    if (drawerLocationBtn) {
        drawerLocationBtn.addEventListener("click", () => {
            if (fullOverlayMenu) fullOverlayMenu.classList.remove("menu-active");
            if (locationModalOverlay) locationModalOverlay.classList.remove("hidden-panel-layout");
        });
    }

    if (closeLocationModal) {
        closeLocationModal.addEventListener("click", () => {
            locationModalOverlay.classList.add("hidden-panel-layout");
        });
    }

    if (countryListOptions) {
        countryListOptions.querySelectorAll("li").forEach(item => {
            item.addEventListener("click", function () {
                const code = this.getAttribute("data-code");
                const flag = this.getAttribute("data-flag");
                setCountry(code, flag);
                locationModalOverlay.classList.add("hidden-panel-layout");
            });
        });
    }

    if (countrySearchInput && countryListOptions) {
        countrySearchInput.addEventListener("input", function () {
            const q = this.value.toLowerCase();
            countryListOptions.querySelectorAll("li").forEach(li => {
                li.style.display = li.textContent.toLowerCase().includes(q) ? "flex" : "none";
            });
        });
    }

    // --- SEARCH MODAL ---
    const drawerSearchBtn = document.getElementById("drawerSearchBtn");
    const searchModalOverlay = document.getElementById("searchModalOverlay");
    const closeSearchModal = document.getElementById("closeSearchModal");

    if (drawerSearchBtn) {
        drawerSearchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (fullOverlayMenu) fullOverlayMenu.classList.remove("menu-active");
            if (searchModalOverlay) searchModalOverlay.classList.remove("hidden-panel-layout");
        });
    }

    if (closeSearchModal) {
        closeSearchModal.addEventListener("click", () => {
            searchModalOverlay.classList.add("hidden-panel-layout");
        });
    }

    // --- FIND SERVICE POINT, PORTALS & BRAND PARTNERSHIPS ROUTING ---
    const drawerFindServicePointBtn = document.getElementById("drawerFindServicePointBtn");
    if (drawerFindServicePointBtn) {
        drawerFindServicePointBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (fullOverlayMenu) fullOverlayMenu.classList.remove("menu-active");
            switchView("locator");
        });
    }

    const drawerPortalLoginsBtn = document.getElementById("drawerPortalLoginsBtn");
    if (drawerPortalLoginsBtn) {
        drawerPortalLoginsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (fullOverlayMenu) fullOverlayMenu.classList.remove("menu-active");
            switchView("portals");
        });
    }

    document.querySelectorAll(".brand-partnerships-trigger, #brandPartnershipsLink").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            if (fullOverlayMenu) fullOverlayMenu.classList.remove("menu-active");
            switchView("partnerships");
        });
    });

    /* ==========================================================================
       4. INTERACTIVE FAQ ACCORDION PANEL ARRAYS
       ========================================================================== */
    const faqAccordions = document.querySelectorAll(".faq-accordion-item");
    faqAccordions.forEach(item => {
        const header = item.querySelector(".faq-trigger-header");
        const panel = item.querySelector(".faq-content-panel");

        if (header && panel) {
            header.addEventListener("click", () => {
                const isOpen = item.classList.contains("accordion-open");
                
                faqAccordions.forEach(otherItem => {
                    otherItem.classList.remove("accordion-open");
                    const otherPanel = otherItem.querySelector(".faq-content-panel");
                    if (otherPanel) otherPanel.style.maxHeight = null;
                });

                if (!isOpen) {
                    item.classList.add("accordion-open");
                    panel.style.maxHeight = panel.scrollHeight + "px";
                } else {
                    item.classList.remove("accordion-open");
                    panel.style.maxHeight = null;
                }
            });
        }
    });

    /* ==========================================================================
       5. CUSTOMER SERVICE ACCORDIONS MECHANICS
       ========================================================================== */
    const csAccordions = document.querySelectorAll(".cs-accordion-item");
    csAccordions.forEach(item => {
        const trigger = item.querySelector(".cs-accordion-trigger");
        const panel = item.querySelector(".cs-accordion-panel");
        const icon = item.querySelector(".cs-plus-icon");

        if (trigger && panel) {
            trigger.addEventListener("click", () => {
                const isDisplayed = panel.style.display === "block";
                
                if (!isDisplayed) {
                    panel.style.display = "block";
                    if (icon) icon.className = "fa-solid fa-minus cs-plus-icon";
                } else {
                    panel.style.display = "none";
                    if (icon) icon.className = "fa-solid fa-plus cs-plus-icon";
                }
            });
        }
    });

    const csHomeBreadcrumb = document.getElementById("csHomeBreadcrumb");
    if (csHomeBreadcrumb) {
        csHomeBreadcrumb.addEventListener("click", () => switchView("home"));
    }

    const openContactFlowTriggers = document.querySelectorAll(".open-contact-flow-trigger");
    openContactFlowTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            switchView("contact");
        });
    });

    const businessTriggerCards = document.querySelectorAll(".business-trigger-card, #homeBusinessTriggerCard, .business-trigger-link");
    businessTriggerCards.forEach(card => {
        card.addEventListener("click", () => switchView("business"));
    });

    const csFooterTrigger = document.querySelector(".cs-footer-trigger");
    if (csFooterTrigger) {
        csFooterTrigger.addEventListener("click", (e) => {
            e.preventDefault();
            switchView("cs");
        });
    }

    /* ==========================================================================
       6. "FIND YOUR CONTACT" FILTER DASHBOARD ARCHITECTURE
       ========================================================================== */
    const divisionCards = document.querySelectorAll(".fc-division-card");
    const ecommerceDetailsPanel = document.getElementById("ecommerceDetailsPanel");
    const genericDetailsPanel = document.getElementById("genericDetailsPanel"); 

    const fcBreadcrumbHome = document.querySelector(".fc-breadcrumb-home");
    const fcBreadcrumbCs = document.querySelector(".fc-breadcrumb-cs");

    if (fcBreadcrumbHome) {
        fcBreadcrumbHome.addEventListener("click", () => switchView("home"));
    }
    if (fcBreadcrumbCs) {
        fcBreadcrumbCs.addEventListener("click", () => switchView("cs"));
    }

    divisionCards.forEach(card => {
        card.addEventListener("click", function () {
            divisionCards.forEach(c => {
                c.style.borderColor = "#cccccc";
                const check = c.querySelector(".fc-check-marker");
                if (check) check.style.display = "none";
            });

            this.style.borderColor = "#d40511";
            const currentCheck = this.querySelector(".fc-check-marker");
            if (currentCheck) currentCheck.style.display = "block";

            const division = this.getAttribute("data-division");
            
            if (division === "ecommerce") {
                if (ecommerceDetailsPanel) ecommerceDetailsPanel.classList.remove("hidden-panel-layout");
                if (genericDetailsPanel) genericDetailsPanel.classList.add("hidden-panel-layout");
            } else {
                if (ecommerceDetailsPanel) ecommerceDetailsPanel.classList.add("hidden-panel-layout");
                if (genericDetailsPanel) {
                    genericDetailsPanel.classList.remove("hidden-panel-layout");
                    const panelTitle = genericDetailsPanel.querySelector(".fc-panel-title");
                    const divisionName = this.querySelector(".fc-div-name")?.textContent || "SHIP OVER SEAS Service";
                    if (panelTitle) panelTitle.textContent = divisionName;
                }
            }

            const activePanel = (division === "ecommerce") ? ecommerceDetailsPanel : genericDetailsPanel;
            if (activePanel) {
                setTimeout(() => {
                    activePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }, 50);
            }
        });
    });

    /* ==========================================================================
       7. DYNAMIC CLICK ROUTING FOR FORM & ACCORDIONS
       ========================================================================== */
    const visitEcommerceBtn = document.querySelector(".fc-btn-visit-division");
    if (visitEcommerceBtn) {
        visitEcommerceBtn.addEventListener("click", function (e) {
            e.preventDefault();
            switchView("form");
        });
    }

    const handleFaqNavigation = function (event) {
        if (event.target.tagName === "A" && event.target.textContent.toLowerCase().includes("frequently asked questions")) {
            event.preventDefault();
            switchView("track");
            const faqContainerSection = document.querySelector(".faq-container-section");
            if (faqContainerSection) {
                setTimeout(() => {
                    faqContainerSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 80);
            }
        }
    };

    if (ecommerceDetailsPanel) {
        ecommerceDetailsPanel.addEventListener("click", handleFaqNavigation);
    }
    if (genericDetailsPanel) {
        genericDetailsPanel.addEventListener("click", handleFaqNavigation);
    }

    /* ==========================================================================
       8. BUSINESS SIGN-UP WIZARD STEPS ENGINE
       ========================================================================== */
    const bizOptionCards = document.querySelectorAll(".biz-selection-option-card");
    bizOptionCards.forEach(card => {
        card.addEventListener("click", function () {
            bizOptionCards.forEach(c => c.classList.remove("checked-option"));
            this.classList.add("checked-option");
        });
    });

    /* ==========================================================================
       9. ECOMMERCE FORM SUBMISSION ROUTING
       ========================================================================== */
    const ecommerceInquiryForm = document.getElementById('ecommerceInquiryForm');

    if (ecommerceInquiryForm) {
        ecommerceInquiryForm.addEventListener('submit', function (event) {
            event.preventDefault();

            if (ecommerceInquiryForm.checkValidity()) {
                switchView("success");
            } else {
                ecommerceInquiryForm.reportValidity();
            }
        });
    }
});
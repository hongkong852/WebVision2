document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('service-search');
    const servicesGrid = document.querySelector('.services-grid');
    const locationInput = document.getElementById('location');
    const logo = document.querySelector('.logo');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Add event listeners for navigation
    logo.addEventListener('click', () => {
        resetToHomepage();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            resetToHomepage();
        });
    });

    function resetToHomepage() {
        document.querySelector('.search-container').style.display = 'block';
        document.querySelector('.featured-services').style.display = 'block';
        document.getElementById('partner-calendar-section').style.display = 'none';
        // Reset the services section title
        document.querySelector('.featured-services h2').textContent = '精選婚禮服務';
        // Refresh the featured services
        fetchFeaturedServices();
    }

    const UPLOADED_IMAGE = '/Hilary-Chan-Photography-Hong-Kong-Engagement-Rosewood-hotel-pre-wedding-photoshoot-portraits-Katie-Jim-08.jpg';
    const MAKEUP_IMAGE = '/makeupA.jpg';  

    // Add event listeners for navigation
    const cart = [];

    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartButton = document.querySelector('.cart-button');
    const closeModalBtn = document.querySelector('.close-modal');

    // Function to update cart icon/count
    function updateCartIcon() {
        cartButton.dataset.count = cart.length;
    }

    const hotelDetails = {
        '四季酒店': {
            description: '座落於中環中心，享有壯觀維港景觀的頂級婚禮場地',
            capacity: '可容納150-250人',
            price: '每場 HKD 248,000起',
            imageUrl: UPLOADED_IMAGE
        },
        '文華東方酒店': {
            description: '香港最具標誌性的奢華婚禮場地，坐落於灣仔',
            capacity: '可容納200-300人',
            price: '每場 HKD 288,000起',
            imageUrl: UPLOADED_IMAGE
        },
        '半島酒店': {
            description: '歷史悠久的經典婚禮場地，尖沙咀海景婚禮首選',
            capacity: '可容納200-350人',
            price: '每場 HKD 298,000起',
            imageUrl: UPLOADED_IMAGE
        },
        '香格里拉酒店': {
            description: '港島香格里拉酒店，現代優雅的婚禮空間',
            capacity: '可容納180-300人',
            price: '每場 HKD 268,000起',
            imageUrl: UPLOADED_IMAGE
        }
    };

    const photographerDetails = {
        '陳大文攝影工作室': {
            description: '知名婚紗攝影師，擅長自然風格和浪漫場景拍攝',
            experience: '資歷15年',
            price: '全日婚紗 HKD 9,999',
            imageUrl: '/婚紗攝影.jpg'
        },
        '李美琪婚紗攝影': {
            description: '曾獲國際婚紗攝影大獎，擅長城市風和輕奢風格',
            experience: '資歷12年',
            price: '全日婚紗 HKD 7,999',
            imageUrl: '/婚紗攝影.jpg'
        },
        '王子豪婚紗攝影': {
            description: '以創意構圖和獨特光影著稱，風格前衛',
            experience: '資歷10年',
            price: '全日婚紗 HKD 6,999',
            imageUrl: '/婚紗攝影.jpg'
        },
        '張雅琳婚紗攝影': {
            description: '溫柔細膩的拍攝風格，擅長捕捉情侶真摯瞬間',
            experience: '資歷8年',
            price: '全日婚紗 HKD 5,999',
            imageUrl: '/婚紗攝影.jpg'
        }
    };

    const photographerCoupons = {
        '陳大文攝影工作室': { code: 'CHEN2024', discount: '1,000' },
        '李美琪婚紗攝影': { code: 'LEE2024', discount: '800' },
        '王子豪婚紗攝影': { code: 'WANG2024', discount: '500' },
        '張雅琳婚紗攝影': { code: 'CHANG2024', discount: '600' }
    };

    const servicesContainer = document.querySelector('.services-container');
    const dateSelectionSidebar = servicesContainer.querySelector('.date-selection-sidebar');

    function generateDateOptions(selectedDate) {
        const baseDate = selectedDate ? new Date(selectedDate) : new Date();
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        
        return [0, 1, 2, 3, 4].map(offset => {
            const date = new Date(baseDate);
            date.setDate(baseDate.getDate() + offset);
            
            return {
                day: days[date.getDay()],
                date: date.toLocaleDateString('zh-TW', {month: 'numeric', day: 'numeric'}),
                fullDate: date.toISOString().split('T')[0]
            };
        });
    }

    function generateTimeSlots(selectedDate) {
        const timeSlots = {
            '2024-03-10': [
                { time: '上午09:00', available: true },
                { time: '中午12:00', available: true },
                { time: '下午15:00', available: true },
                { time: '晚上18:00', available: false }
            ],
            '2024-03-11': [
                { time: '上午10:00', available: true },
                { time: '中午13:00', available: true },
                { time: '下午16:00', available: false },
                { time: '晚上19:00', available: true }
            ],
            '2024-03-12': [
                { time: '上午11:00', available: true },
                { time: '中午14:00', available: false },
                { time: '下午17:00', available: true },
                { time: '晚上20:00', available: true }
            ],
            '2024-03-13': [
                { time: '上午08:00', available: true },
                { time: '中午11:00', available: true },
                { time: '下午14:00', available: true },
                { time: '晚上17:00', available: false }
            ],
            '2024-03-14': [
                { time: '上午09:30', available: true },
                { time: '中午12:30', available: true },
                { time: '下午15:30', available: true },
                { time: '晚上18:30', available: true }
            ]
        };

        return {
            timeSlots: timeSlots[selectedDate] || [],
            hasAvailableSlots: timeSlots[selectedDate]?.some(slot => slot.available) || false
        };
    }

    const serviceList = document.getElementById('service-list');
    const serviceTypeSelect = document.getElementById('service-type');

    function updateServiceList() {
        const serviceType = serviceTypeSelect.value;
        
        serviceList.innerHTML = '';

        if (serviceType === '婚禮場地') {
            Object.keys(hotelDetails).forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel;
                option.textContent = hotel;
                serviceList.appendChild(option);
            });
        } else if (serviceType === '婚紗攝影') {
            Object.keys(photographerDetails).forEach(photographer => {
                const option = document.createElement('option');
                option.value = photographer;
                option.textContent = photographer;
                serviceList.appendChild(option);
            });
        } else {
            Object.keys(hotelDetails).forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel;
                option.textContent = hotel + ' (婚禮場地)';
                serviceList.appendChild(option);
            });

            Object.keys(photographerDetails).forEach(photographer => {
                const option = document.createElement('option');
                option.value = photographer;
                option.textContent = photographer + ' (婚紗攝影)';
                serviceList.appendChild(option);
            });
        }
    }

    serviceTypeSelect.addEventListener('change', updateServiceList);

    updateServiceList();

    function addToCart(service) {
        // If it's a photographer service and has a coupon code
        if (service.photographer && photographerCoupons[service.photographer]) {
            const couponInfo = photographerCoupons[service.photographer];
            service.couponCode = couponInfo.code;
            service.discount = couponInfo.discount;
            
            // Adjust the price
            const originalPrice = parseInt(service.price.replace(/[^\d]/g, ''));
            const discount = parseInt(couponInfo.discount.replace(/[^\d]/g, ''));
            service.originalPrice = service.price;
            service.price = `HKD ${(originalPrice - discount).toLocaleString()}`;
        }
        
        cart.push(service);
        updateCartIcon();
        updateCart();
        alert('已成功加入合約！');
    }

    function updateCart() {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.hotel || item.title || item.photographer}</h4>
                    <p>${item.description || ''}</p>
                    <p>${item.date ? `日期: ${item.date}` : ''}</p>
                    <p>${item.timeSlot ? `時間: ${item.timeSlot}` : ''}</p>
                    ${item.couponCode ? `
                        <p class="coupon-info">
                            優惠碼: ${item.couponCode}<br>
                            原價: ${item.originalPrice}<br>
                            折扣: -HKD ${item.discount}
                        </p>
                    ` : ''}
                    <p>價格: ${item.price}</p>
                    ${item.selectedServices ? `<p>選擇服務: ${item.selectedServices.join(', ')}</p>` : ''}
                </div>
                <span class="cart-item-remove" data-index="${index}">🗑️</span>
            </div>
        `).join('');

        // Calculate total (remove non-numeric characters and parse)
        const total = cart.reduce((sum, item) => {
            const price = item.price.replace(/[^\d]/g, '');
            return sum + parseInt(price || 0, 10);
        }, 0);

        cartTotal.textContent = `HKD ${total.toLocaleString()}`;

        // Add remove item functionality
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                updateCart();
                updateCartIcon();
            });
        });
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedProvider = locationInput.value;
        const serviceType = serviceTypeSelect.value;
        const selectedDate = document.querySelector('input[name="date"]').value;
        
        const MAKEUP_IMAGE = '/makeupA.jpg';  
        const UPLOADED_IMAGE = '/Hilary-Chan-Photography-Hong-Kong-Engagement-Rosewood-hotel-pre-wedding-photoshoot-portraits-Katie-Jim-08.jpg';

        const servicesSection = document.querySelector('.featured-services h2');
        servicesSection.textContent = `${serviceType} / ${selectedDate.replace('-', '年').replace('-', '月') + '日'}`;
        
        // First show list of providers based on service type
        if (serviceType === '婚紗攝影') {
            // Show photographers list
            const photographersList = Object.keys(photographerDetails);
            servicesGrid.innerHTML = photographersList.map(photographer => `
                <div class="service-card" data-provider="${photographer}">
                    <img src="${MAKEUP_IMAGE}" alt="${photographer}">
                    <div class="service-details">
                        <h3>${photographer}</h3>
                        <p>${photographerDetails[photographer].description}</p>
                        <p>攝影師經驗: ${photographerDetails[photographer].experience}</p>
                        <span class="price">${photographerDetails[photographer].price}</span>
                        <button class="view-btn" data-provider="${photographer}">檢視</button>
                    </div>
                </div>
            `).join('');
            
            // Clear the sidebar
            dateSelectionSidebar.innerHTML = '';
            
            // Add event listeners for View buttons
            const viewBtns = servicesGrid.querySelectorAll('.view-btn');
            viewBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const photographer = btn.dataset.provider;
                    showProviderAvailability(photographer, 'photographer', selectedDate);
                });
            });
        } else if (serviceType === '婚禮場地') {
            // Show hotels list
            const hotelsList = Object.keys(hotelDetails);
            servicesGrid.innerHTML = hotelsList.map(hotel => `
                <div class="service-card" data-provider="${hotel}">
                    <img src="${UPLOADED_IMAGE}" alt="${hotel}">
                    <div class="service-details">
                        <h3>${hotel}</h3>
                        <p>${hotelDetails[hotel].description}</p>
                        <p>場地容量: ${hotelDetails[hotel].capacity}</p>
                        <span class="price">${hotelDetails[hotel].price}</span>
                        <button class="view-btn" data-provider="${hotel}">檢視</button>
                        <button class="tour-360-btn">360° 虛擬導覽</button>
                        <button class="floor-plan-btn">2D Floor Plan</button>
                    </div>
                </div>
            `).join('');
            
            // Clear the sidebar
            dateSelectionSidebar.innerHTML = '';
            
            // Add event listeners for View buttons
            const viewBtns = servicesGrid.querySelectorAll('.view-btn');
            viewBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const hotel = btn.dataset.provider;
                    showProviderAvailability(hotel, 'hotel', selectedDate);
                });
            });
            
            // Add event listeners for 360 tour buttons in search results
            document.querySelectorAll('.tour-360-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const hotel = e.target.closest('.service-card').dataset.provider;
                    showVirtualTour(hotel);
                });
            });
            
            // Add event listeners for floor plan buttons in search results
            document.querySelectorAll('.floor-plan-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const hotel = e.target.closest('.service-card').dataset.provider;
                    showFloorPlan(hotel);
                });
            });
        } else {
            fetchFeaturedServices();
        }
    });
    
    // Function to show provider's availability calendar
    function showProviderAvailability(provider, type, selectedDate) {
        // Update main content to show single provider
        if (type === 'photographer') {
            const couponInfo = photographerCoupons[provider];
            servicesGrid.innerHTML = `
                <div class="service-card full-width">
                    <img src="${MAKEUP_IMAGE}" alt="${provider}">
                    <div class="service-details">
                        <h3>${provider} 婚紗攝影</h3>
                        <p>${photographerDetails[provider].description}</p>
                        <p>攝影師經驗: ${photographerDetails[provider].experience}</p>
                        <span class="price">${photographerDetails[provider].price}</span>
                        <button class="coupon-btn" data-code="${couponInfo.code}">
                            優惠碼: ${couponInfo.code}<br>
                            折扣: HKD ${couponInfo.discount}
                        </button>
                        <div class="service-options">
                            <h4>可選服務</h4>
                            <div class="checkbox-group">
                                <div class="checkbox-item">
                                    <input type="checkbox" id="service1" name="service1" value="全天婚紗拍攝">
                                    <label for="service1">全天婚紗拍攝 (+HKD 0)</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="service2" name="service2" value="精修照片20張">
                                    <label for="service2">精修照片20張 (+HKD 1,200)</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="service3" name="service3" value="化妝及髮型設計">
                                    <label for="service3">化妝及髮型設計 (+HKD 2,500)</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="service4" name="service4" value="婚紗租借">
                                    <label for="service4">婚紗租借 (+HKD 3,000)</label>
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" id="service5" name="service5" value="實體相冊製作">
                                    <label for="service5">實體相冊製作 (+HKD 1,800)</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const couponBtn = servicesGrid.querySelector('.coupon-btn');
            couponBtn.addEventListener('click', () => {
                const code = couponBtn.dataset.code;
                navigator.clipboard.writeText(code).then(() => {
                    alert(`優惠碼 ${code} 已複製到剪貼簿！`);
                });
            });
        } else if (type === 'hotel') {
            servicesGrid.innerHTML = `
                <div class="service-card full-width">
                    <img src="${UPLOADED_IMAGE}" alt="${provider}">
                    <div class="service-details">
                        <h3>${provider} 婚禮場地</h3>
                        <p>${hotelDetails[provider].description}</p>
                        <p>場地容量: ${hotelDetails[provider].capacity}</p>
                        <span class="price">${hotelDetails[provider].price}</span>
                        <button class="tour-360-btn">360° 虛擬導覽</button>
                        <button class="floor-plan-btn">2D Floor Plan</button>
                    </div>
                </div>
            `;
            
            // Add event listener for 360 tour button
            document.querySelectorAll('.tour-360-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    showVirtualTour(provider);
                });
            });
            
            // Add event listener for floor plan button
            document.querySelectorAll('.floor-plan-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    showFloorPlan(provider);
                });
            });
        }
        
        // Show availability calendar in the sidebar
        const today = new Date(selectedDate);
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
        
        // Events data - available time slots
        const { timeSlots } = generateTimeSlots(selectedDate);
        
        // Create calendar HTML
        let calendarHTML = `
            <div class="booking-calendar">
                <div class="calendar-header">${monthNames[currentMonth]} ${currentYear}</div>
                <div class="days-grid">
        `;
        
        // Add day headers
        dayNames.forEach(day => {
            calendarHTML += `<div class="day-header">${day}</div>`;
        });
        
        // Add empty cells before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarHTML += `<div class="calendar-day empty"></div>`;
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateString = date.toISOString().split('T')[0];
            const isSelectedDate = dateString === selectedDate;
            const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isSelectedDate ? 'selected' : ''}" 
                     data-date="${dateString}">
                    ${day}
                    ${isSelectedDate ? '<div class="has-slots">可預約</div>' : ''}
                </div>
            `;
        }
        
        calendarHTML += `</div>`;
        
        // Add time slots for selected date
        if (timeSlots.length > 0) {
            calendarHTML += `
                <div class="time-slots-container">
                    <h3>可預約時段 (${selectedDate.replace('-', '年').replace('-', '月') + '日'})</h3>
                    <div class="time-slots-grid">
                        ${timeSlots.map(slot => `
                            <div class="time-slot-item ${!slot.available ? 'disabled' : ''}" data-time="${slot.time}">
                                ${slot.time}
                                <span class="slot-status">${slot.available ? '可預約' : '已滿額'}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="confirmation-btn" id="booking-confirm">預約並簽約</button>
                </div>
            `;
        }
        
        calendarHTML += `</div>`;
        
        dateSelectionSidebar.innerHTML = calendarHTML;
        
        // Add calendar event listeners - same as before
        document.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
            day.addEventListener('click', () => {
                const date = day.dataset.date;
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                
                // Show confirmation popup for the selected date
                const hasAvailableSlots = day.querySelector('.has-slots') !== null;
                if (hasAvailableSlots) {
                    const confirmBooking = confirm(`確認選擇預約日期: ${date.replace('-', '年').replace('-', '月') + '日'}?`);
                    if (confirmBooking) {
                        // Automatically add to smart contract if confirmed
                        const serviceDetails = servicesGrid.querySelector('.service-details');
                        const title = serviceDetails.querySelector('h3').textContent;
                        const price = serviceDetails.querySelector('.price').textContent;
                        const description = serviceDetails.querySelector('p').textContent;
                        
                        const cartItem = {
                            [type]: provider,
                            date: date,
                            timeSlot: "系統自動安排",
                            price: price,
                            description: description
                        };
                        
                        addToCart(cartItem);
                        alert(`已成功加入合約！\n${title}\n日期: ${date.replace('-', '年').replace('-', '月') + '日'}`);
                    }
                }
                
                const { timeSlots } = generateTimeSlots(date);
                
                if (timeSlots.length > 0) {
                    const timeSlotContainer = document.querySelector('.time-slots-container') || document.createElement('div');
                    timeSlotContainer.className = 'time-slots-container';
                    timeSlotContainer.innerHTML = `
                        <h3>可預約時段 (${date.replace('-', '年').replace('-', '月') + '日'})</h3>
                        <div class="time-slots-grid">
                            ${timeSlots.map(slot => `
                                <div class="time-slot-item ${!slot.available ? 'disabled' : ''}" data-time="${slot.time}">
                                    ${slot.time}
                                    <span class="slot-status">${slot.available ? '可預約' : '已滿額'}</span>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    
                    if (!document.querySelector('.time-slots-container')) {
                        document.querySelector('.booking-calendar').appendChild(timeSlotContainer);
                    }
                    
                    document.querySelectorAll('.time-slot-item:not(.disabled)').forEach(slot => {
                        slot.addEventListener('click', () => {
                            document.querySelectorAll('.time-slot-item').forEach(s => s.classList.remove('selected'));
                            slot.classList.add('selected');
                        });
                    });
                    
                    const confirmBtn = document.getElementById('booking-confirm');
                    if (confirmBtn) {
                        confirmBtn.addEventListener('click', () => {
                            const selectedTimeSlot = document.querySelector('.time-slot-item.selected');
                            if (selectedTimeSlot) {
                                const timeSlot = selectedTimeSlot.dataset.time;
                                const serviceDetails = servicesGrid.querySelector('.service-details');
                                const price = serviceDetails.querySelector('.price').textContent;
                                
                                const cartItem = {
                                    [type]: provider,
                                    date: date,
                                    timeSlot: timeSlot,
                                    price: price,
                                    description: serviceDetails.querySelector('p').textContent
                                };
                                
                                alert(`已確認預約並簽約：\n
${type === 'photographer' ? '攝影師' : '酒店'}: ${cartItem[type]}\n
日期: ${cartItem.date}\n
時間: ${cartItem.timeSlot}\n
價格: ${cartItem.price}\n
描述: ${cartItem.description}`);
                                
                                addToCart(cartItem);
                            } else {
                                alert('請選擇一個時間段');
                            }
                        });
                    }
                }
            });
        });
        
        // Add time slot event listeners
        document.querySelectorAll('.time-slot-item:not(.disabled)').forEach(slot => {
            slot.addEventListener('click', () => {
                document.querySelectorAll('.time-slot-item').forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
            });
        });
        
        // Add confirmation button event listener
        const confirmBtn = document.getElementById('booking-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const selectedTimeSlot = document.querySelector('.time-slot-item.selected');
                if (selectedTimeSlot) {
                    const timeSlot = selectedTimeSlot.dataset.time;
                    const serviceDetails = servicesGrid.querySelector('.service-details');
                    const price = serviceDetails.querySelector('.price').textContent;
                    
                    // Get selected options for photographers
                    const selectedOptions = [];
                    if (type === 'photographer') {
                        document.querySelectorAll('.checkbox-item input:checked').forEach(checkbox => {
                            selectedOptions.push(checkbox.value);
                        });
                    }
                    
                    const cartItem = {
                        [type]: provider,
                        date: selectedDate,
                        timeSlot: timeSlot,
                        price: price,
                        description: serviceDetails.querySelector('p').textContent
                    };
                    
                    // Add selected services if any
                    if (selectedOptions.length > 0) {
                        cartItem.selectedServices = selectedOptions;
                    }
                    
                    const confirmMessage = `已確認預約並簽約：\n
${type === 'photographer' ? '攝影師' : '酒店'}: ${cartItem[type]}\n
日期: ${cartItem.date}\n
時間: ${cartItem.timeSlot}\n
價格: ${cartItem.price}\n
描述: ${cartItem.description}${selectedOptions.length > 0 ? '\n選擇服務: ' + selectedOptions.join(', ') : ''}`;
                    
                    const confirmAdd = confirm(confirmMessage);
                    if (confirmAdd) {
                        addToCart(cartItem);
                    }
                } else {
                    alert('請選擇一個時間段');
                }
            });
        }
    }
    
    cartButton.addEventListener('click', () => {
        updateCart();
        cartModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    checkoutBtn.addEventListener('click', () => {
        // Prepare the contract details
        const contractDetails = cart.map(item => {
            let details = `${item.hotel || item.title || item.photographer}\n`;
            details += `${item.description || ''}\n`;
            details += `${item.date ? `日期: ${item.date}\n` : ''}`;
            details += `${item.timeSlot ? `時間: ${item.timeSlot}\n` : ''}`;
            if (item.couponCode) {
                details += `優惠碼: ${item.couponCode}\n`;
                details += `原價: ${item.originalPrice}\n`;
                details += `折扣: -HKD ${item.discount}\n`;
            }
            details += `價格: ${item.price}\n`;
            if (item.selectedServices) {
                details += `選擇服務: ${item.selectedServices.join(', ')}\n`;
            }
            return details;
        }).join('\n---\n');

        // Generate a contract text
        const contractText = `
            WED-VISION 婚禮服務合約

            合約條款:
            本合約確認您與Wed-Vision及其合作夥伴之間的服務預訂。
            請仔細閱讀以下條款和條件：

            服務詳情:
            ${contractDetails}

            總金額: HKD ${cartTotal.textContent.replace('HKD ', '')}

            條款及細則:
            1. 預訂確認後，取消預訂可能會產生費用。
            2. 所有款項需在服務日期前支付。
            3. 合作夥伴的具體條款和條件適用。
            4. 本合約一經簽署即具法律效力。
            5. 任何更改需經雙方書面同意。
            6. 本合約受香港特別行政區法律管轄。

            甲方（客戶）簽名:                乙方（服務商）簽名:
            _________________________      _________________________
            
            見證人簽名:
            _________________________
            
            合約編號: WV-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}-${new Date().getFullYear()}
            簽約日期: ${new Date().toLocaleDateString('zh-HK')}
        `;

        // Open a new window/tab to display the contract
        const contractWindow = window.open('', '_blank');
        contractWindow.document.write(`
            <html>
            <head>
                <title>Wed-Vision 婚禮服務合約</title>
                <style>
                    body { font-family: "Times New Roman", serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
                    h2 { color: #333; text-align: center; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 10px; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .logo { font-weight: bold; font-size: 24px; color: #FF6B6B; }
                    .contract { white-space: pre-line; }
                    .date { text-align: right; }
                    .seal { display: inline-block; border: 2px solid #FF6B6B; color: #FF6B6B; padding: 10px; border-radius: 50%; font-weight: bold; margin-top: 20px; transform: rotate(-15deg); }
                    .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
                    .signature-line { border-top: 1px solid #000; width: 200px; padding-top: 5px; }
                    @media print {
                        body { padding: 0; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">Wed-Vision</div>
                    <div class="date">日期: ${new Date().toLocaleDateString('zh-HK')}</div>
                </div>
                <h2>婚禮服務合約</h2>
                <div class="contract">${contractText}</div>
                <div style="text-align: right; margin-top: 30px;">
                    <div class="seal">APPROVED</div>
                </div>
                <button onclick="window.print()" style="display: block; margin: 30px auto; padding: 10px 20px; background-color: #FF6B6B; color: white; border: none; border-radius: 5px; cursor: pointer;">列印合約</button>
            </body>
            </html>
        `);
    });

    const partnerBtn = document.getElementById('host-btn');
    const partnerModal = document.getElementById('partner-modal');
    const partnerCalendarSection = document.getElementById('partner-calendar-section');
    const partnerCloseBtn = document.querySelector('.partner-close');
    const partnerApplicationBtn = document.getElementById('partner-application-btn');

    partnerBtn.addEventListener('click', () => {
        partnerCalendarSection.style.display = 'block';
        document.querySelector('.featured-services').style.display = 'none';
        document.querySelector('.search-container').style.display = 'none';
    });

    partnerApplicationBtn.addEventListener('click', () => {
        alert('感謝您對成為Wed-Vision合作商感興趣！\n我們的客戶代表將在1-2個工作日內與您聯繫。');
        partnerCalendarSection.style.display = 'none';
        document.querySelector('.featured-services').style.display = 'block';
        document.querySelector('.search-container').style.display = 'block';
    });

    window.addEventListener('click', (e) => {
        if (e.target === partnerModal) {
            partnerModal.style.display = 'none';
        }
    });

    async function fetchFeaturedServices() {
        try {
            const mockServices = [
                { 
                    title: '浪漫海景婚紗', 
                    price: '$9,999', 
                    location: '中環', 
                    imageUrl: UPLOADED_IMAGE  
                },
                { 
                    title: '頂級婚紗攝影套餐', 
                    price: '$3,999', 
                    location: '尖沙咀', 
                    imageUrl: UPLOADED_IMAGE  
                },
                { 
                    title: '輕奢風婚紗', 
                    price: '$2,499', 
                    location: '金鐘', 
                    imageUrl: UPLOADED_IMAGE  
                },
                { 
                    title: '自然風格婚紗', 
                    price: '$1,999', 
                    location: '灣仔', 
                    imageUrl: UPLOADED_IMAGE  
                }
            ];

            servicesGrid.innerHTML = mockServices.map(service => `
                <div class="service-card">
                    <img src="${service.imageUrl}" alt="${service.title}">
                    <div class="service-details">
                        <h3>${service.title}</h3>
                        <p>${service.location}</p>
                        <span class="price">${service.price}</span>
                        <button class="add-to-cart-btn">加入購物車</button>
                    </div>
                </div>
            `).join('');

            // Add event listeners for Add to Cart buttons
            const addToCartBtns = servicesGrid.querySelectorAll('.add-to-cart-btn');
            addToCartBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    addToCart(mockServices[index]);
                });
            });
        } catch (error) {
            console.error('Failed to fetch services', error);
        }
    }

    function showVirtualTour(hotel) {
        // Create a modal for the virtual tour
        const tourModal = document.createElement('div');
        tourModal.className = 'modal tour-modal';
        tourModal.style.display = 'block';
        
        tourModal.innerHTML = `
            <div class="modal-content tour-content">
                <span class="close-modal">&times;</span>
                <h2>${hotel} - 360° 虛擬導覽</h2>
                <div class="tour-container">
                    <div class="tour-view">
                        <div class="panorama-placeholder">
                            <div class="panorama-instructions">
                                <h3>360° 全景虛擬導覽</h3>
                                <p>使用滑鼠拖動以查看場地的各個角度</p>
                                <div class="panorama-controls">
                                    <button class="control-btn" data-direction="left">⬅️</button>
                                    <button class="control-btn" data-direction="up">⬆️</button>
                                    <button class="control-btn" data-direction="down">⬇️</button>
                                    <button class="control-btn" data-direction="right">➡️</button>
                                    <button class="control-btn" data-direction="zoom-in">🔍+</button>
                                    <button class="control-btn" data-direction="zoom-out">🔍-</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tour-info">
                        <h3>場地信息</h3>
                        <p>${hotelDetails[hotel].description}</p>
                        <p>場地容量: ${hotelDetails[hotel].capacity}</p>
                        <p>價格: ${hotelDetails[hotel].price}</p>
                        <button class="book-venue-btn">預約此場地</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(tourModal);
        
        // Add close functionality
        const closeBtn = tourModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(tourModal);
        });
        
        // Add booking functionality
        const bookBtn = tourModal.querySelector('.book-venue-btn');
        bookBtn.addEventListener('click', () => {
            document.body.removeChild(tourModal);
            showProviderAvailability(hotel, 'hotel', document.querySelector('input[name="date"]').value);
        });
        
        // Add panorama control functionality
        const controlBtns = tourModal.querySelectorAll('.control-btn');
        let rotateX = 0;
        let rotateY = 0;
        let scale = 1;
        
        controlBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.dataset.direction;
                const panorama = tourModal.querySelector('.panorama-placeholder');
                
                switch(direction) {
                    case 'left':
                        rotateY -= 15;
                        break;
                    case 'right':
                        rotateY += 15;
                        break;
                    case 'up':
                        rotateX -= 15;
                        break;
                    case 'down':
                        rotateX += 15;
                        break;
                    case 'zoom-in':
                        scale += 0.1;
                        break;
                    case 'zoom-out':
                        scale = Math.max(0.5, scale - 0.1);
                        break;
                }
                
                panorama.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
            });
        });
        
        // Close when clicking outside of the modal content
        window.addEventListener('click', (e) => {
            if (e.target === tourModal) {
                document.body.removeChild(tourModal);
            }
        });
    }
    
    function showFloorPlan(hotel) {
        // Create a modal for the floor plan
        const floorPlanModal = document.createElement('div');
        floorPlanModal.className = 'modal floor-plan-modal';
        floorPlanModal.style.display = 'block';
        
        floorPlanModal.innerHTML = `
            <div class="modal-content floor-plan-content">
                <span class="close-modal">&times;</span>
                <h2>${hotel} - 2D 平面圖</h2>
                <div class="floor-plan-container">
                    <div class="floor-plan-view">
                        <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                            <!-- Main Room -->
                            <rect x="100" y="100" width="600" height="400" stroke="#333" stroke-width="3" fill="#f9f9f9" />
                            
                            <!-- Stage Area -->
                            <rect x="350" y="100" width="100" height="40" stroke="#555" stroke-width="2" fill="#e0e0e0" />
                            <text x="400" y="125" text-anchor="middle" font-size="14">舞台</text>
                            
                            <!-- Table Arrangement -->
                            ${generateTables()}
                            
                            <!-- Entrance -->
                            <rect x="390" y="500" width="20" height="30" stroke="#555" stroke-width="2" fill="#bbdefb" />
                            <path d="M370 500 Q400 530 430 500" stroke="#555" stroke-width="2" fill="none" />
                            <text x="400" y="550" text-anchor="middle" font-size="14">入口</text>
                            
                            <!-- VIP Table -->
                            <circle cx="400" cy="180" r="40" stroke="#d32f2f" stroke-width="2" fill="#ffcdd2" />
                            <text x="400" y="185" text-anchor="middle" font-size="14">主家席</text>
                            
                            <!-- Dancefloor -->
                            <rect x="300" y="250" width="200" height="150" stroke="#8e24aa" stroke-width="2" fill="#e1bee7" fill-opacity="0.5" />
                            <text x="400" y="325" text-anchor="middle" font-size="14">舞池</text>
                            
                            <!-- Bar Area -->
                            <rect x="650" y="250" width="50" height="100" stroke="#555" stroke-width="2" fill="#dcedc8" />
                            <text x="675" y="300" transform="rotate(90, 675, 300)" text-anchor="middle" font-size="14">酒吧</text>
                            
                            <!-- Photo Area -->
                            <rect x="100" y="250" width="50" height="100" stroke="#555" stroke-width="2" fill="#fff9c4" />
                            <text x="125" y="300" transform="rotate(270, 125, 300)" text-anchor="middle" font-size="14">拍照區</text>
                        </svg>
                    </div>
                    <div class="floor-plan-info">
                        <h3>場地平面圖資料</h3>
                        <p>${hotelDetails[hotel].description}</p>
                        <p>場地容量: ${hotelDetails[hotel].capacity}</p>
                        <p>價格: ${hotelDetails[hotel].price}</p>
                        <div class="plan-legend">
                            <h4>圖例說明</h4>
                            <div class="legend-item">
                                <span class="color-box" style="background-color: #ffcdd2;"></span>
                                <span>主家席</span>
                            </div>
                            <div class="legend-item">
                                <span class="color-box" style="background-color: #e1bee7; opacity: 0.5;"></span>
                                <span>舞池</span>
                            </div>
                            <div class="legend-item">
                                <span class="color-box" style="background-color: #dcedc8;"></span>
                                <span>酒吧</span>
                            </div>
                            <div class="legend-item">
                                <span class="color-box" style="background-color: #fff9c4;"></span>
                                <span>拍照區</span>
                            </div>
                            <div class="legend-item">
                                <span class="color-circle"></span>
                                <span>圓形餐桌 (10人)</span>
                            </div>
                        </div>
                        <button class="book-venue-btn">預約此場地</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(floorPlanModal);
        
        // Add close functionality
        const closeBtn = floorPlanModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(floorPlanModal);
        });
        
        // Add booking functionality
        const bookBtn = floorPlanModal.querySelector('.book-venue-btn');
        bookBtn.addEventListener('click', () => {
            document.body.removeChild(floorPlanModal);
            showProviderAvailability(hotel, 'hotel', document.querySelector('input[name="date"]').value);
        });
        
        // Close when clicking outside of the modal content
        window.addEventListener('click', (e) => {
            if (e.target === floorPlanModal) {
                document.body.removeChild(floorPlanModal);
            }
        });
    }
    
    function generateTables() {
        let tablesHTML = '';
        
        // Generate circular tables
        const tablePositions = [
            {x: 200, y: 200}, {x: 300, y: 200}, {x: 500, y: 200}, {x: 600, y: 200},
            {x: 200, y: 350}, {x: 600, y: 350},
            {x: 200, y: 450}, {x: 300, y: 450}, {x: 500, y: 450}, {x: 600, y: 450}
        ];
        
        tablePositions.forEach((pos, index) => {
            tablesHTML += `
                <circle cx="${pos.x}" cy="${pos.y}" r="25" stroke="#555" stroke-width="1" fill="#fff" />
                <text x="${pos.x}" y="${pos.y+5}" text-anchor="middle" font-size="12">${index+1}</text>
            `;
        });
        
        return tablesHTML;
    }

    fetchFeaturedServices();
});
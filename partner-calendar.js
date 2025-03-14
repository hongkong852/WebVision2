document.addEventListener('DOMContentLoaded', () => {
    const partnerBtn = document.getElementById('host-btn');
    const calendarContainer = document.querySelector('.partner-calendar');
    let availabilityData = {};

    partnerBtn.addEventListener('click', () => {
        renderCalendar();
    });

    function renderCalendar() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
        
        // Events data - example
        const events = [
            { date: new Date(currentYear, currentMonth, 5), title: '新合作商培訓' },
            { date: new Date(currentYear, currentMonth, 12), title: '合作商季度會議' },
            { date: new Date(currentYear, currentMonth, 18), title: '婚展籌備會議' },
            { date: new Date(currentYear, currentMonth, 25), title: '新品發佈會' }
        ];
        
        // Create calendar HTML
        let calendarHTML = `
            <div class="calendar-header">${monthNames[currentMonth]} ${currentYear}</div>
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
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const hasEvent = events.some(event => 
                event.date.getDate() === day && 
                event.date.getMonth() === currentMonth && 
                event.date.getFullYear() === currentYear
            );
            
            const event = events.find(event => 
                event.date.getDate() === day && 
                event.date.getMonth() === currentMonth && 
                event.date.getFullYear() === currentYear
            );
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'current' : ''} ${hasEvent ? 'has-event' : ''}" 
                     data-date="${date.toISOString().split('T')[0]}"
                     title="${hasEvent ? event.title : ''}">
                    ${day}
                    ${hasEvent ? `<div class="event-indicator"></div>` : ''}
                </div>
            `;
        }
        
        calendarContainer.innerHTML = calendarHTML;
        
        // Add event listeners for calendar days
        document.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
            day.addEventListener('click', () => {
                const date = day.dataset.date;
                showAvailabilityInput(date);
            });
        });
    }

    function showAvailabilityInput(date) {
        const existingData = availabilityData[date] || { times: [], description: '' };

        const timeOptions = [
            '上午09:00', '上午10:00', '上午11:00',
            '中午12:00', '下午13:00', '下午14:00',
            '下午15:00', '下午16:00', '下午17:00',
            '晚上18:00', '晚上19:00', '晚上20:00'
        ];

        let timeSelectionHTML = '';
        timeOptions.forEach(time => {
            const isSelected = existingData.times.includes(time);
            timeSelectionHTML += `
                <label>
                    <input type="checkbox" value="${time}" ${isSelected ? 'checked' : ''}>
                    ${time}
                </label>
            `;
        });

        const inputHTML = `
            <div class="availability-input">
                <h3>${date} 可用時間和內容</h3>
                <div class="time-selection">
                    ${timeSelectionHTML}
                </div>
                <label for="description-${date}">內容:</label>
                <textarea id="description-${date}">${existingData.description}</textarea>
                <button id="save-${date}">儲存</button>
            </div>
        `;
        
        const calendarSection = document.getElementById('partner-calendar-section');
        calendarSection.innerHTML = `
            <h2>合作商業務日曆</h2>
            <div class="partner-calendar">
                ${calendarContainer.innerHTML}
            </div>
            ${inputHTML}
            <div class="partner-actions">
                <button id="partner-application-btn">開始申請</button>
            </div>
        `;

        document.getElementById(`save-${date}`).addEventListener('click', () => {
            const selectedTimes = Array.from(document.querySelectorAll('.availability-input input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);
            const description = document.getElementById(`description-${date}`).value;
            availabilityData[date] = { times: selectedTimes, description: description };
            alert(`已儲存 ${date} 的時間和內容!`);
        });

        document.getElementById('partner-application-btn').addEventListener('click', () => {
            alert('感謝您對成為Wed-Vision合作商感興趣！\n我們的客戶代表將在1-2個工作日內與您聯繫。');
            document.getElementById('partner-calendar-section').style.display = 'none';
            document.querySelector('.featured-services').style.display = 'block';
            document.querySelector('.search-container').style.display = 'block';
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const deviceList = document.querySelector('.device-list');
    const nextStepBtn = document.querySelector('.next-step-btn');

    let selectedDevice = null; // 선택된 단말기를 저장할 변수

    // 가상의 단말기 데이터 (실제로는 API 또는 DB에서 가져옴)
    const devices = [
        { id: 'galaxy_s25', name: '갤럭시 S25', manufacturer: 'samsung', price: 1000000, img: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=S25' },
        { id: 'iphone_16_pro', name: '아이폰 16 Pro', manufacturer: 'apple', price: 1500000, img: 'https://via.placeholder.com/150/FFC107/FFFFFF?text=iP17' },
        { id: 'galaxy_z_flip7', name: '갤럭시 Z Flip 7', manufacturer: 'samsung', price: 1350000, img: 'https://via.placeholder.com/150/2196F3/FFFFFF?text=Flip7' },
        { id: 'iphone_16e4', name: '아이폰 16e', manufacturer: 'apple', price: 1050000, img: 'https://via.placeholder.com/150/9C27B0/FFFFFF?text=iPSE4' },
        // 더 많은 단말기 데이터를 추가할 수 있습니다.
    ];

    // --- 단말기 카드 렌더링 함수 (필터링 적용) ---
    function renderDevices(filteredDevices) {
        deviceList.innerHTML = ''; // 기존 목록 초기화
        if (filteredDevices.length === 0) {
            deviceList.innerHTML = '<p style="text-align: center; color: #6c757d; grid-column: 1 / -1;">선택하신 조건에 맞는 단말기가 없습니다.</p>';
            return;
        }

        filteredDevices.forEach(device => {
            const deviceCard = document.createElement('div');
            deviceCard.classList.add('device-card');
            if (selectedDevice && selectedDevice.id === device.id) {
                deviceCard.classList.add('selected'); // 이전에 선택된 상태 유지
            }
            deviceCard.dataset.id = device.id;
            deviceCard.dataset.manufacturer = device.manufacturer;
            deviceCard.dataset.price = device.price; // 가격 필터링을 위해 data-price 추가

            deviceCard.innerHTML = `
                <img src="${device.img}" alt="${device.name}">
                <h3>${device.name}</h3>
                <p>출고가: ${device.price.toLocaleString()}원</p>
            `;
            deviceList.appendChild(deviceCard);
        });
    }

    // --- 단말기 카드 클릭 이벤트 ---
    deviceList.addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.device-card');
        if (clickedCard) {
            // 이전에 선택된 카드에서 'selected' 클래스 제거
            const currentlySelected = document.querySelector('.device-card.selected');
            if (currentlySelected && currentlySelected !== clickedCard) {
                currentlySelected.classList.remove('selected');
            }

            // 클릭된 카드에 'selected' 클래스 토글
            clickedCard.classList.toggle('selected');
            selectedDevice = clickedCard.classList.contains('selected') ? {
                id: clickedCard.dataset.id,
                name: clickedCard.querySelector('h3').textContent,
                price: parseInt(clickedCard.dataset.price),
                manufacturer: clickedCard.dataset.manufacturer
            } : null;

            // 단말기가 선택되었는지 여부에 따라 다음 단계 버튼 활성화/비활성화
            nextStepBtn.disabled = !selectedDevice;
        }
    });

    // --- 슬라이더 로직 ---
    const sliders = [
        { id: 'data-slider', outputId: 'data-value', labels: ['0MB', '1GB', '3GB', '5GB', '10GB', '50GB', '100GB', '100GB+'] },
        { id: 'voice-slider', outputId: 'voice-value', labels: ['0분', '50분', '100분', '250분', '500분', '무제한'] },
        { id: 'sms-slider', outputId: 'sms-value', labels: ['0건', '50건', '100건', '250건', '500건', '무제한'] },
        { id: 'price-slider', outputId: 'price-value', labels: ['0원', '40만원', '80만원', '120만원', '160만원', '160만원+'] }
    ];

    sliders.forEach(sliderInfo => {
        const slider = document.getElementById(sliderInfo.id);
        const output = document.getElementById(sliderInfo.outputId);

        // 초기 값 설정
        const initialValue = slider.value;
        const initialPercent = ((initialValue - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.setProperty('--value-percent', `${initialPercent}%`);
        output.textContent = sliderInfo.labels[slider.value / (slider.max / (sliderInfo.labels.length - 1))];
        updateSliderThumbPosition(slider, output);

        slider.oninput = () => {
            const value = slider.value;
            const percent = ((value - slider.min) / (slider.max - slider.min)) * 100;
            slider.style.setProperty('--value-percent', `${percent}%`); // 진행 바 업데이트

            // 슬라이더 값에 해당하는 라벨 표시
            const labelIndex = Math.floor((value - slider.min) / (slider.max / (sliderInfo.labels.length - 1)));
            output.textContent = sliderInfo.labels[labelIndex];
            updateSliderThumbPosition(slider, output);
        };
    });

    // 슬라이더 썸(핸들) 위치에 따라 값 표시 위치 조절
    function updateSliderThumbPosition(slider, output) {
        const thumbWidth = 24; // 슬라이더 썸의 너비 (CSS와 일치)
        const trackWidth = slider.offsetWidth;
        const value = slider.value;
        const min = slider.min;
        const max = slider.max;

        const range = max - min;
        const percent = (value - min) / range;

        // 슬라이더 썸의 중앙에 위치하도록 계산
        const thumbPosition = percent * (trackWidth - thumbWidth) + thumbWidth / 2;
        output.style.setProperty('--thumb-left', `${thumbPosition}px`);
    }

    // 초기 로드 시 모든 슬라이더 위치 업데이트 (반응형 대응)
    window.addEventListener('resize', () => {
        sliders.forEach(sliderInfo => {
            const slider = document.getElementById(sliderInfo.id);
            const output = document.getElementById(sliderInfo.outputId);
            updateSliderThumbPosition(slider, output);
        });
    });


    // --- 버튼 그룹 필터 로직 ---
    const buttonGroups = document.querySelectorAll('.button-group');

    buttonGroups.forEach(group => {
        group.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.filter-btn');
            if (clickedButton && group.contains(clickedButton)) { // 클릭된 요소가 버튼 그룹 내 버튼인지 확인
                // 현재 그룹의 모든 active 클래스 제거
                group.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                // 클릭된 버튼에 active 클래스 추가
                clickedButton.classList.add('active');

                // 여기에 필터링 로직 추가 (예: 제조사 필터링)
                applyFilters();
            }
        });
    });

    // --- 아코디언 (상세 스펙) 로직 ---
    const detailSpecToggle = document.getElementById('detail-spec-toggle');
    const detailSpecContent = document.getElementById('detail-spec-content');

    detailSpecToggle.addEventListener('click', () => {
        detailSpecToggle.classList.toggle('active');
        detailSpecContent.classList.toggle('active');
    });

    // --- 필터 적용 함수 (모든 필터가 적용될 때 호출) ---
    function applyFilters() {
        const selectedManufacturer = document.querySelector('#manufacturer-filter .filter-btn.active').dataset.value;
        const selectedPriceMax = parseInt(document.getElementById('price-slider').value) * 10000; // 슬라이더 값에 만원 곱하기

        let filteredDevices = devices.filter(device => {
            // 제조사 필터링
            const manufacturerMatch = selectedManufacturer === 'all' || device.manufacturer === selectedManufacturer;

            // 가격 필터링 (슬라이더 최소값 0, 최대값 160(만원)을 기준으로 예시)
            const priceMatch = device.price <= selectedPriceMax;
            if (selectedPriceMax === 1600000 && document.getElementById('price-slider').value === '160') { // 160만원+ 처리
                 // 최대값이 '160만원+'인 경우, 160만원 이상 모든 가격을 포함
                 return manufacturerMatch; // 가격 필터링 무시
            }

            return manufacturerMatch && priceMatch;
        });

        renderDevices(filteredDevices);
    }

    // 초기 단말기 렌더링
    renderDevices(devices);
});

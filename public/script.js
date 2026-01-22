// 追溯系统前端交互逻辑

// DOM元素
const searchForm = document.getElementById('searchForm');
const resetBtn = document.getElementById('resetBtn');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');

// 模拟数据 - 直接嵌入到JavaScript中
const mockData = [
  {
    "traceCode": "TEA2024000001",
    "name": "西湖龙井",
    "type": "绿茶",
    "origin": "浙江省杭州市",
    "producer": "杭州西湖茶叶有限公司",
    "productionDate": "2024-03-15",
    "harvestDate": "2024-03-10",
    "processingSteps": [
      {
        "step": "采摘",
        "date": "2024-03-10",
        "description": "新鲜茶叶采摘"
      },
      {
        "step": "加工",
        "date": "2024-03-11",
        "description": "茶叶加工处理"
      },
      {
        "step": "烘焙",
        "date": "2024-03-12",
        "description": "茶叶烘焙"
      }
    ],
    "qualityTest": {
      "passed": true,
      "testDate": "2024-03-14",
      "testResults": "质量检测合格，符合国家标准"
    },
    "packagingInfo": {
      "material": "纸质包装",
      "packageDate": "2024-03-15",
      "packageQuantity": 100
    },
    "distributionInfo": [
      {
        "location": "杭州西湖茶叶有限公司",
        "date": "2024-03-15",
        "status": "包装完成"
      },
      {
        "location": "杭州茶叶批发市场",
        "date": "2024-03-16",
        "status": "运输中"
      },
      {
        "location": "上海茶叶专卖店",
        "date": "2024-03-18",
        "status": "已上架"
      }
    ]
  },
  {
    "traceCode": "TEA2024000002",
    "name": "大红袍",
    "type": "乌龙茶",
    "origin": "福建省武夷山市",
    "producer": "武夷山岩茶有限公司",
    "productionDate": "2024-04-05",
    "harvestDate": "2024-03-28",
    "processingSteps": [
      {
        "step": "采摘",
        "date": "2024-03-28",
        "description": "新鲜茶叶采摘"
      },
      {
        "step": "萎凋",
        "date": "2024-03-29",
        "description": "茶叶萎凋处理"
      },
      {
        "step": "做青",
        "date": "2024-03-30",
        "description": "茶叶做青工艺"
      },
      {
        "step": "烘焙",
        "date": "2024-04-02",
        "description": "茶叶烘焙"
      }
    ],
    "qualityTest": {
      "passed": true,
      "testDate": "2024-04-04",
      "testResults": "质量检测合格，符合乌龙茶国家标准"
    },
    "packagingInfo": {
      "material": "陶瓷罐装",
      "packageDate": "2024-04-05",
      "packageQuantity": 50
    },
    "distributionInfo": [
      {
        "location": "武夷山岩茶有限公司",
        "date": "2024-04-05",
        "status": "包装完成"
      },
      {
        "location": "福州茶叶批发市场",
        "date": "2024-04-06",
        "status": "运输中"
      },
      {
        "location": "北京茶叶专卖店",
        "date": "2024-04-08",
        "status": "已上架"
      }
    ]
  },
  {
    "traceCode": "TEA2024000003",
    "name": "祁门红茶",
    "type": "红茶",
    "origin": "安徽省祁门县",
    "producer": "祁门红茶有限公司",
    "productionDate": "2024-05-10",
    "harvestDate": "2024-05-05",
    "processingSteps": [
      {
        "step": "采摘",
        "date": "2024-05-05",
        "description": "新鲜茶叶采摘"
      },
      {
        "step": "萎凋",
        "date": "2024-05-06",
        "description": "茶叶萎凋处理"
      },
      {
        "step": "揉捻",
        "date": "2024-05-07",
        "description": "茶叶揉捻工艺"
      },
      {
        "step": "发酵",
        "date": "2024-05-08",
        "description": "茶叶发酵工艺"
      },
      {
        "step": "烘干",
        "date": "2024-05-09",
        "description": "茶叶烘干处理"
      }
    ],
    "qualityTest": {
      "passed": true,
      "testDate": "2024-05-09",
      "testResults": "质量检测合格，符合红茶国家标准"
    },
    "packagingInfo": {
      "material": "铁罐包装",
      "packageDate": "2024-05-10",
      "packageQuantity": 80
    },
    "distributionInfo": [
      {
        "location": "祁门红茶有限公司",
        "date": "2024-05-10",
        "status": "包装完成"
      },
      {
        "location": "合肥茶叶批发市场",
        "date": "2024-05-11",
        "status": "运输中"
      },
      {
        "location": "广州茶叶专卖店",
        "date": "2024-05-13",
        "status": "已上架"
      }
    ]
  }
];

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 显示消息
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // 插入到结果区域顶部
    if (resultSection.style.display === 'block') {
        resultContent.insertBefore(messageDiv, resultContent.firstChild);
    } else {
        // 如果结果区域未显示，显示在搜索框下方
        const searchBox = document.querySelector('.search-box');
        searchBox.appendChild(messageDiv);
    }
    
    // 3秒后自动移除
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 显示茶叶信息
function displayTeaInfo(tea) {
    resultContent.innerHTML = `
        <div class="tea-info">
            <h3>${tea.name}</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>追溯码</strong>
                    ${tea.traceCode}
                </div>
                <div class="info-item">
                    <strong>茶叶类型</strong>
                    ${tea.type}
                </div>
                <div class="info-item">
                    <strong>产地</strong>
                    ${tea.origin}
                </div>
                <div class="info-item">
                    <strong>生产商</strong>
                    ${tea.producer}
                </div>
                <div class="info-item">
                    <strong>生产日期</strong>
                    ${formatDate(tea.productionDate)}
                </div>
                <div class="info-item">
                    <strong>采摘日期</strong>
                    ${formatDate(tea.harvestDate)}
                </div>
            </div>
            
            <h4 class="section-title">加工步骤</h4>
            ${tea.processingSteps.length > 0 ? `
                <ul class="steps-list">
                    ${tea.processingSteps.map(step => `
                        <li>
                            <strong>${step.step}</strong>
                            <p>日期: ${formatDate(step.date)}</p>
                            ${step.description ? `<p>${step.description}</p>` : ''}
                        </li>
                    `).join('')}
                </ul>
            ` : '<p>暂无加工步骤信息</p>'}
            
            <h4 class="section-title">质量检测</h4>
            <div class="info-item">
                <strong>检测结果</strong>
                ${tea.qualityTest.passed ? '通过' : '未通过'}
            </div>
            <div class="info-item">
                <strong>检测日期</strong>
                ${formatDate(tea.qualityTest.testDate)}
            </div>
            ${tea.qualityTest.testResults ? `
                <div class="info-item">
                    <strong>检测详情</strong>
                    ${tea.qualityTest.testResults}
                </div>
            ` : ''}
            
            <h4 class="section-title">包装信息</h4>
            <div class="info-grid">
                <div class="info-item">
                    <strong>包装材料</strong>
                    ${tea.packagingInfo.material}
                </div>
                <div class="info-item">
                    <strong>包装日期</strong>
                    ${formatDate(tea.packagingInfo.packageDate)}
                </div>
                <div class="info-item">
                    <strong>包装数量</strong>
                    ${tea.packagingInfo.packageQuantity}
                </div>
            </div>
            
            <h4 class="section-title">物流信息</h4>
            ${tea.distributionInfo.length > 0 ? `
                <ul class="distribution-list">
                    ${tea.distributionInfo.map(info => `
                        <li>
                            <strong>${info.location}</strong>
                            <p>日期: ${formatDate(info.date)}</p>
                            <p>状态: ${info.status}</p>
                        </li>
                    `).join('')}
                </ul>
            ` : '<p>暂无物流信息</p>'}
        </div>
    `;
    
    resultSection.style.display = 'block';
}

// 查询茶叶信息
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const traceCode = document.getElementById('traceCode').value.trim();
    
    if (!traceCode) {
        showMessage('请输入追溯码', 'error');
        return;
    }
    
    try {
        // 从localStorage获取用户添加的数据
        const userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
        
        // 合并数据
        const allData = [...mockData, ...userAddedData];
        
        // 查找匹配的追溯码
        const tea = allData.find(item => item.traceCode === traceCode);
        
        if (tea) {
            displayTeaInfo(tea);
        } else {
            showMessage('未找到该茶叶信息', 'error');
            resultSection.style.display = 'none';
        }
    } catch (error) {
        showMessage('查询失败，请重试', 'error');
        resultSection.style.display = 'none';
    }
});

// 重置查询
resetBtn.addEventListener('click', () => {
    searchForm.reset();
    resultSection.style.display = 'none';
    resultContent.innerHTML = '';
});

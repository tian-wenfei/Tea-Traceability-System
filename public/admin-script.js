// 管理员后台管理系统逻辑

// DOM元素
const loginPage = document.getElementById('loginPage');
const adminPage = document.getElementById('adminPage');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const logoutBtn = document.getElementById('logoutBtn');
const traceabilityList = document.getElementById('traceabilityList');
const messageDiv = document.getElementById('message');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const changePasswordForm = document.getElementById('changePasswordForm');
const adminAccountsSection = document.getElementById('admin-accounts-section');
const accountsList = document.getElementById('accountsList');
const addAccountBtn = document.getElementById('addAccountBtn');
const addAccountModal = document.getElementById('addAccountModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelAddBtn = document.getElementById('cancelAddBtn');
const addAccountForm = document.getElementById('addAccountForm');
const addTeaBtn = document.getElementById('addTeaBtn');
const addTeaModal = document.getElementById('addTeaModal');
const closeTeaModalBtn = document.getElementById('closeTeaModalBtn');
const cancelAddTeaBtn = document.getElementById('cancelAddTeaBtn');
const addTeaForm = document.getElementById('addTeaForm');
// 修改密码相关DOM元素
const changeUserPasswordModal = document.getElementById('changeUserPasswordModal');
const changeUserPasswordForm = document.getElementById('changeUserPasswordForm');
const closeChangePasswordModalBtn = document.getElementById('closeChangePasswordModalBtn');
const cancelChangePasswordBtn = document.getElementById('cancelChangePasswordBtn');
const targetUsernameInput = document.getElementById('targetUsername');

// 主账户默认信息
const MAIN_ADMIN = {
    username: 'fyca',
    password: 'fyca2025',
    role: 'admin',
    isMain: true
};

// 初始化账户数据
function initializeAccounts() {
    const existingAccounts = localStorage.getItem('adminAccounts');
    if (!existingAccounts) {
        // 如果没有账户数据，初始化主账户
        localStorage.setItem('adminAccounts', JSON.stringify([MAIN_ADMIN]));
    }
}

// 获取所有账户
function getAllAccounts() {
    const accounts = localStorage.getItem('adminAccounts');
    return accounts ? JSON.parse(accounts) : [];
}

// 保存账户列表
function saveAccounts(accounts) {
    localStorage.setItem('adminAccounts', JSON.stringify(accounts));
}

// 获取当前登录用户
function getCurrentUser() {
    const user = localStorage.getItem('currentAdminUser');
    return user ? JSON.parse(user) : null;
}

// 设置当前登录用户
function setCurrentUser(user) {
    localStorage.setItem('currentAdminUser', JSON.stringify(user));
}

// 检查用户是否是主账户
function isMainAdmin(user) {
    return user && user.isMain === true;
}

// 初始化账户数据
initializeAccounts();

// 显示消息
function showMessage(message, type) {
    messageDiv.innerHTML = `
        <div class="message ${type}">
            ${message}
        </div>
    `;
    
    // 3秒后自动移除
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 3000);
}

// 显示登录消息
function showLoginMessage(message, type) {
    loginMessage.innerHTML = `
        <div class="message ${type}">
            ${message}
        </div>
    `;
    
    // 3秒后自动移除
    setTimeout(() => {
        loginMessage.innerHTML = '';
    }, 3000);
}

// 检查用户是否已登录
function checkLoginStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        loginPage.style.display = 'none';
        adminPage.style.display = 'block';
        
        // 根据用户角色显示或隐藏账户管理功能
        if (isMainAdmin(currentUser)) {
            adminAccountsSection.style.display = 'block';
            loadAccounts();
        } else {
            adminAccountsSection.style.display = 'none';
        }
        
        loadTraceabilityCodes();
    } else {
        loginPage.style.display = 'block';
        adminPage.style.display = 'none';
    }
}

// 登录处理
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    let accounts = getAllAccounts();
    
    // 查找匹配的账户
    let user = accounts.find(account => account.username === username && account.password === password);
    
    if (user) {
        // 确保主账户具有isMain属性
        if (username === 'fyca') {
            user.isMain = true;
            // 更新账户列表中的主账户信息
            accounts = accounts.map(account => {
                if (account.username === username) {
                    return user;
                }
                return account;
            });
            saveAccounts(accounts);
        } else {
            // 确保副账户isMain属性为false
            user.isMain = false;
        }
        
        // 登录成功
        setCurrentUser(user);
        showLoginMessage('登录成功', 'success');
        
        // 跳转到管理员页面
        setTimeout(() => {
            checkLoginStatus();
        }, 1000);
    } else {
        // 登录失败
        showLoginMessage('用户名或密码错误', 'error');
    }
});

// 选项卡切换功能
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // 移除所有活跃状态
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // 添加当前活跃状态
        btn.classList.add('active');
        document.getElementById(`${targetTab}-panel`).classList.add('active');
    });
});

// 修改密码处理
changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    const currentUser = getCurrentUser();
    const accounts = getAllAccounts();
    
    // 验证当前密码
    if (currentPassword !== currentUser.password) {
        showMessage('当前密码错误', 'error');
        return;
    }
    
    // 验证新密码和确认密码是否一致
    if (newPassword !== confirmPassword) {
        showMessage('新密码和确认密码不一致', 'error');
        return;
    }
    
    // 验证新密码长度
    if (newPassword.length < 6) {
        showMessage('新密码长度不能少于6个字符', 'error');
        return;
    }
    
    // 更新密码
    const updatedAccounts = accounts.map(account => {
        if (account.username === currentUser.username) {
            return {
                ...account,
                password: newPassword
            };
        }
        return account;
    });
    
    saveAccounts(updatedAccounts);
    
    // 更新当前登录用户的密码
    setCurrentUser({
        ...currentUser,
        password: newPassword
    });
    
    showMessage('密码修改成功', 'success');
    
    // 重置表单
    changePasswordForm.reset();
});

// 退出登录
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentAdminUser');
    showMessage('已成功退出登录', 'success');
    
    // 跳转到登录页面
    setTimeout(() => {
        checkLoginStatus();
    }, 1000);
});

// 加载账户列表（主账户专属）
function loadAccounts() {
    const accounts = getAllAccounts();
    
    if (accounts.length === 0) {
        accountsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">暂无账户数据</p>';
        return;
    }
    
    accountsList.innerHTML = accounts.map((account, index) => {
        const roleText = account.isMain ? '主账户' : '副账户';
        return `
            <div class="traceability-item">
                <div>
                    <strong>用户名:</strong> ${account.username}<br>
                    <strong>角色:</strong> ${roleText}
                </div>
                <div class="action-buttons">
                    ${!account.isMain ? `
                        <button class="btn btn-secondary" onclick="showChangePasswordModal('${account.username}')">修改密码</button>
                        <button class="btn btn-danger" onclick="deleteAccount('${account.username}')">删除</button>
                    ` : '<span style="color: #666;">不可操作</span>'}
                </div>
            </div>
        `;
    }).join('');
}

// 删除账户（主账户专属）
function deleteAccount(username) {
    if (confirm('确定要删除这个账户吗？')) {
        let accounts = getAllAccounts();
        
        // 过滤掉要删除的账户，保留主账户
        accounts = accounts.filter(account => account.username !== username || account.isMain);
        
        saveAccounts(accounts);
        showMessage('账户删除成功', 'success');
        loadAccounts();
    }
}

// 显示修改密码模态框
function showChangePasswordModal(username) {
    targetUsernameInput.value = username;
    changeUserPasswordModal.style.display = 'flex';
}

// 关闭修改密码模态框
function closeChangePasswordModal() {
    changeUserPasswordModal.style.display = 'none';
    changeUserPasswordForm.reset();
}

// 关闭修改密码模态框事件监听
closeChangePasswordModalBtn.addEventListener('click', closeChangePasswordModal);
cancelChangePasswordBtn.addEventListener('click', closeChangePasswordModal);

// 点击模态框外部关闭
changeUserPasswordModal.addEventListener('click', (e) => {
    if (e.target === changeUserPasswordModal) {
        closeChangePasswordModal();
    }
});

// 修改用户密码处理
changeUserPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const targetUsername = targetUsernameInput.value;
    const newPassword = document.getElementById('newPasswordForUser').value.trim();
    const confirmPassword = document.getElementById('confirmPasswordForUser').value.trim();
    
    // 验证密码一致性
    if (newPassword !== confirmPassword) {
        showMessage('两次输入的密码不一致', 'error');
        return;
    }
    
    // 验证密码长度
    if (newPassword.length < 6) {
        showMessage('密码长度不能少于6个字符', 'error');
        return;
    }
    
    // 获取所有账户
    let accounts = getAllAccounts();
    
    // 找到目标账户
    const accountIndex = accounts.findIndex(account => account.username === targetUsername);
    
    if (accountIndex !== -1) {
        // 更新密码
        accounts[accountIndex] = {
            ...accounts[accountIndex],
            password: newPassword
        };
        
        // 保存更新后的账户列表
        saveAccounts(accounts);
        
        showMessage(`用户 ${targetUsername} 的密码修改成功`, 'success');
        closeChangePasswordModal();
        loadAccounts();
    } else {
        showMessage('未找到该用户', 'error');
    }
});

// 显示添加账户模态框
addAccountBtn.addEventListener('click', () => {
    addAccountModal.style.display = 'flex';
});

// 关闭添加账户模态框
function closeAddAccountModal() {
    addAccountModal.style.display = 'none';
    addAccountForm.reset();
}

closeModalBtn.addEventListener('click', closeAddAccountModal);
cancelAddBtn.addEventListener('click', closeAddAccountModal);

// 点击模态框外部关闭
addAccountModal.addEventListener('click', (e) => {
    if (e.target === addAccountModal) {
        closeAddAccountModal();
    }
});

// 添加账户处理
addAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newUserPassword').value.trim();
    const confirmPassword = document.getElementById('confirmUserPassword').value.trim();
    
    // 验证密码一致性
    if (newPassword !== confirmPassword) {
        showMessage('两次输入的密码不一致', 'error');
        return;
    }
    
    // 验证密码长度
    if (newPassword.length < 6) {
        showMessage('密码长度不能少于6个字符', 'error');
        return;
    }
    
    // 检查用户名是否已存在
    const accounts = getAllAccounts();
    if (accounts.some(account => account.username === newUsername)) {
        showMessage('该用户名已存在', 'error');
        return;
    }
    
    // 添加新账户
    const newAccount = {
        username: newUsername,
        password: newPassword,
        role: 'user',
        isMain: false
    };
    
    accounts.push(newAccount);
    saveAccounts(accounts);
    
    showMessage('账户添加成功', 'success');
    loadAccounts();
    closeAddAccountModal();
});

// 显示添加茶叶信息模态框
addTeaBtn.addEventListener('click', () => {
    addTeaModal.style.display = 'flex';
});

// 关闭添加茶叶信息模态框
function closeAddTeaModal() {
    addTeaModal.style.display = 'none';
    addTeaForm.reset();
}

closeTeaModalBtn.addEventListener('click', closeAddTeaModal);
cancelAddTeaBtn.addEventListener('click', closeAddTeaModal);

// 点击模态框外部关闭
addTeaModal.addEventListener('click', (e) => {
    if (e.target === addTeaModal) {
        closeAddTeaModal();
    }
});

// 添加茶叶信息处理
addTeaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    const originValue = document.getElementById('adminOrigin').value.trim();
    
    const teaData = {
        traceCode: document.getElementById('adminTraceCode').value.trim(),
        name: document.getElementById('adminName').value.trim(),
        type: document.getElementById('adminType').value,
        origin: originValue,
        producer: document.getElementById('adminProducer').value.trim(),
        productionDate: document.getElementById('adminProductionDate').value,
        harvestDate: document.getElementById('adminHarvestDate').value,
        addedBy: currentUser.username, // 添加者用户名
        processingSteps: [
            {
                step: '采摘',
                date: document.getElementById('adminHarvestDate').value,
                description: '新鲜茶叶采摘'
            },
            {
                step: '加工',
                date: document.getElementById('adminProductionDate').value,
                description: '茶叶加工处理'
            }
        ],
        qualityTest: {
            passed: true,
            testDate: document.getElementById('adminProductionDate').value,
            testResults: '质量检测合格'
        },
        packagingInfo: {
            material: document.getElementById('adminPackageMaterial').value.trim(),
            packageDate: document.getElementById('adminProductionDate').value,
            packageQuantity: 1
        },
        distributionInfo: [
            {
                location: originValue,
                date: document.getElementById('adminProductionDate').value,
                status: '包装完成'
            }
        ]
    };
    
    try {
        // 从localStorage获取现有数据
        const existingData = JSON.parse(localStorage.getItem('teaData')) || [];
        
        // 检查追溯码是否已存在
        const isDuplicate = existingData.some(item => item.traceCode === teaData.traceCode);
        if (isDuplicate) {
            showMessage('该追溯码已存在', 'error');
            return;
        }
        
        // 添加新数据
        const updatedData = [...existingData, teaData];
        
        // 保存到localStorage
        localStorage.setItem('teaData', JSON.stringify(updatedData));
        
        showMessage('茶叶信息添加成功', 'success');
        loadTraceabilityCodes();
        closeAddTeaModal();
    } catch (error) {
        showMessage('添加失败，请重试', 'error');
    }
});

// 加载所有追溯码
function loadTraceabilityCodes() {
    const currentUser = getCurrentUser();
    
    // 从localStorage获取用户添加的数据
    const userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
    
    // 模拟数据（从script.js中复制），并添加添加者信息
    const mockData = [
        { traceCode: 'TEA2024000001', name: '西湖龙井', type: '绿茶', addedBy: 'system' },
        { traceCode: 'TEA2024000002', name: '大红袍', type: '乌龙茶', addedBy: 'system' },
        { traceCode: 'TEA2024000003', name: '祁门红茶', type: '红茶', addedBy: 'system' }
    ];
    
    // 合并数据
    const allData = [...mockData, ...userAddedData];
    
    // 根据用户角色筛选数据
    let filteredData;
    if (isMainAdmin(currentUser)) {
        // 主账户可以查看所有数据
        filteredData = allData;
    } else {
        // 普通账户只能查看自己添加的数据
        filteredData = allData.filter(tea => tea.addedBy === currentUser.username);
    }
    
    // 反转数据顺序，使最新添加的追溯码显示在最前面
    filteredData = [...filteredData].reverse();
    
    // 显示追溯码列表
    if (filteredData.length === 0) {
        traceabilityList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">暂无追溯码数据</p>';
        return;
    }
    
    traceabilityList.innerHTML = filteredData.map((tea, index) => {
        // 确定添加者显示文本
        const addedByText = tea.addedBy === 'system' ? '系统' : tea.addedBy;
        
        // 主账户显示添加者，副账户不显示
        const addedByHtml = isMainAdmin(currentUser) ? `<strong>添加者:</strong> ${addedByText}<br>` : '';
        
        return `
            <div class="traceability-item">
                <div>
                    <strong>追溯码:</strong> ${tea.traceCode}<br>
                    <strong>茶叶名称:</strong> ${tea.name}<br>
                    <strong>茶叶类型:</strong> ${tea.type}<br>
                    ${addedByHtml}
                </div>
                <div class="action-buttons">
                    <button class="btn btn-danger" onclick="deleteTraceabilityCode('${tea.traceCode}')">删除</button>
                </div>
            </div>
        `;
    }).join('');
}

// 删除追溯码
function deleteTraceabilityCode(traceCode) {
    const currentUser = getCurrentUser();
    
    if (confirm('确定要删除这个追溯码吗？')) {
        // 从localStorage获取用户添加的数据
        let userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
        
        // 找到要删除的茶叶数据
        const teaIndex = userAddedData.findIndex(tea => tea.traceCode === traceCode);
        
        if (teaIndex !== -1) {
            const teaToDelete = userAddedData[teaIndex];
            
            // 检查权限：主账户可以删除所有，普通用户只能删除自己添加的
            if (isMainAdmin(currentUser) || teaToDelete.addedBy === currentUser.username) {
                // 执行删除操作
                userAddedData = userAddedData.filter(tea => tea.traceCode !== traceCode);
                localStorage.setItem('teaData', JSON.stringify(userAddedData));
                showMessage('追溯码已成功删除', 'success');
                loadTraceabilityCodes();
            } else {
                showMessage('您只能删除自己添加的追溯码', 'error');
            }
        } else {
            showMessage('未找到该追溯码或该追溯码不可删除', 'error');
        }
    }
}

// 统计功能相关函数

// 获取茶叶数据，根据用户角色过滤
function getAllTeaData() {
    const currentUser = getCurrentUser();
    const userAddedData = JSON.parse(localStorage.getItem('teaData')) || [];
    const mockData = [
        { traceCode: 'TEA2024000001', name: '西湖龙井', type: '绿茶', origin: '浙江省杭州市', producer: '杭州西湖茶叶有限公司', productionDate: '2024-03-15', harvestDate: '2024-03-10', packagingInfo: { material: '纸质包装' }, addedBy: 'system' },
        { traceCode: 'TEA2024000002', name: '大红袍', type: '乌龙茶', origin: '福建省武夷山市', producer: '武夷山岩茶有限公司', productionDate: '2024-04-05', harvestDate: '2024-03-28', packagingInfo: { material: '陶瓷罐装' }, addedBy: 'system' },
        { traceCode: 'TEA2024000003', name: '祁门红茶', type: '红茶', origin: '安徽省祁门县', producer: '祁门红茶有限公司', productionDate: '2024-05-10', harvestDate: '2024-05-05', packagingInfo: { material: '铁罐包装' }, addedBy: 'system' }
    ];
    
    let allData;
    
    // 检查当前用户是否为主账户
    if (currentUser && currentUser.isMain === true) {
        // 主账户可以查看所有数据（系统预设 + 所有用户添加）
        allData = [...mockData, ...userAddedData];
    } else {
        // 副账户只能查看自己添加的数据
        allData = userAddedData.filter(tea => tea.addedBy === currentUser.username);
    }
    
    return allData;
}

// 统计指定字段的分布情况
function countFieldDistribution(data, field, nestedField = null) {
    const count = {};
    data.forEach(item => {
        let value;
        if (nestedField) {
            value = item[field]?.[nestedField] || '未知';
        } else {
            value = item[field] || '未知';
        }
        count[value] = (count[value] || 0) + 1;
    });
    return count;
}

// 生成统计HTML
function generateStatisticsHtml(countData) {
    const sortedData = Object.entries(countData).sort((a, b) => b[1] - a[1]);
    return sortedData.map(([key, value]) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
            <span>${key}</span>
            <span style="font-weight: bold; color: #2c7d4d;">${value} 个</span>
        </div>
    `).join('');
}

// 生成日期统计HTML
function generateDateStatisticsHtml(data, dateField) {
    const count = countFieldDistribution(data, dateField);
    const sortedDates = Object.entries(count).sort();
    return sortedDates.map(([date, count]) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
            <span>${date}</span>
            <span style="font-weight: bold; color: #2c7d4d;">${count} 个</span>
        </div>
    `).join('');
}

// 更新所有统计数据
function updateStatistics() {
    const teaData = getAllTeaData();
    
    // 统计茶叶名称
    const nameCount = countFieldDistribution(teaData, 'name');
    document.getElementById('nameStatistics').innerHTML = generateStatisticsHtml(nameCount);
    
    // 统计茶叶类型
    const typeCount = countFieldDistribution(teaData, 'type');
    document.getElementById('typeStatistics').innerHTML = generateStatisticsHtml(typeCount);
    
    // 统计产地
    const originCount = countFieldDistribution(teaData, 'origin');
    document.getElementById('originStatistics').innerHTML = generateStatisticsHtml(originCount);
    
    // 统计生产商
    const producerCount = countFieldDistribution(teaData, 'producer');
    document.getElementById('producerStatistics').innerHTML = generateStatisticsHtml(producerCount);
    
    // 统计包装材料
    const materialCount = countFieldDistribution(teaData, 'packagingInfo', 'material');
    document.getElementById('materialStatistics').innerHTML = generateStatisticsHtml(materialCount);
    
    // 统计生产日期
    document.getElementById('productionDateStatistics').innerHTML = generateDateStatisticsHtml(teaData, 'productionDate');
    
    // 统计采摘日期
    document.getElementById('harvestDateStatistics').innerHTML = generateDateStatisticsHtml(teaData, 'harvestDate');
}

// 监听选项卡切换，当切换到统计面板时更新数据
const statisticsPanel = document.getElementById('statistics-panel');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        if (targetTab === 'statistics') {
            updateStatistics();
        }
    });
});

// 初始化
checkLoginStatus();

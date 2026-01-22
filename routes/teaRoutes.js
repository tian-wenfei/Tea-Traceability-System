const express = require('express');
const router = express.Router();
const Tea = require('../models/teaModel');

// 创建茶叶信息
router.post('/create', async (req, res) => {
  try {
    const tea = new Tea(req.body);
    await tea.save();
    res.status(201).json({ message: '茶叶信息创建成功', data: tea });
  } catch (error) {
    res.status(500).json({ message: '创建失败', error: error.message });
  }
});

// 根据追溯码查询茶叶信息
router.get('/:traceCode', async (req, res) => {
  try {
    const { traceCode } = req.params;
    const tea = await Tea.findOne({ traceCode });
    if (!tea) {
      return res.status(404).json({ message: '未找到该茶叶信息' });
    }
    res.status(200).json({ message: '查询成功', data: tea });
  } catch (error) {
    res.status(500).json({ message: '查询失败', error: error.message });
  }
});

// 获取所有茶叶信息
router.get('/', async (req, res) => {
  try {
    const teas = await Tea.find();
    res.status(200).json({ message: '查询成功', data: teas });
  } catch (error) {
    res.status(500).json({ message: '查询失败', error: error.message });
  }
});

module.exports = router;

const express = require('express');
const path = require('path');
const apiHandler = require('./apiHandler');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3300;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 处理根路径请求
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', './index.html'));
});

app.post('/api', apiHandler);

// 启动服务器
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


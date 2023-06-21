const canvasConfig = {
	imgSrc: 'maobi03-w.png',
	row: true,
	scale: 100,
	letterSpacing: 20,
	lineSpacing: 20,
};

// 获取 canvas 和 context 对象
const canvas = document.querySelector('#textsCanvas');
const context = canvas.getContext('2d');
// 设置 canvas 全屏

const drawText = (strokeData, offsetx, offsety) => {
	const image = new Image();
	image.src = canvasConfig.imgSrc;
	image.addEventListener('load', () => {
		for (const [index, lineTexts] of strokeData.entries()) {
			for (const [idx, stroke] of lineTexts.entries()) {
				if (!stroke.co) {
					continue; // 如果 stroke.co 不存在，则跳过这个元素
				}

				const scale = canvasConfig.scale;
				let spaceX = (scale + canvasConfig.letterSpacing) * idx;
				let spaceY = (scale + canvasConfig.lineSpacing) * index;
				if (canvasConfig.row) {
					spaceX = (scale + canvasConfig.letterSpacing) * index;
					spaceY = (scale + canvasConfig.lineSpacing) * idx;
				}

				for (let i = 0; i < stroke.co.length; i++) {
					const co = stroke.co[i];
					const pressure = stroke.pressure[i];
					const strength = stroke.strength[i];

					for (const [j, element] of co.entries()) {
						const cox = element[0];
						const coy = 1 - element[1];
						const x = cox * scale + spaceX;
						const y = coy * scale + spaceY;

						context.save();
						context.translate(x, y);
						context.rotate(Math.random() * 3);
						const pressureScale = pressure[j] * (1 / image.width * scale * 2) * 0.99999999;
						context.scale(pressureScale, pressureScale);
						context.globalAlpha = strength[j];
						context.drawImage(image, -image.width / 2, -image.height / 2);

						context.restore();
					}
				}
			}
		}
	});
};

const fetchData = async postData => {
	const url = 'http://localhost:3300/api';
	const response = await fetch(url, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(postData),
	});
	if (!response.ok) {
		throw new Error(`Fetch failed with status ${response.status}`);
	}

	return response.json();
};






function submitData() {	
	const textarea = document.querySelector('textarea');
	const textareaData = textarea.value;
	const linesTextsList = textareaData.split('\n').map(line => {
		if (line.trim() === '') { // 如果是空行
			return '\n'; // 返回两个换行符
		}
		return line.trim() + '\n'; // 否则返回去除首尾空格的文本加一个换行符
	});
	const linesTexts = linesTextsList.join('');	

	var fontSelect = document.getElementById('fontSelect');
	var fontName = fontSelect.value;

	const postData = {
		db: fontName,
		dbTable: fontName,
		dbName: linesTexts,
	};
	const strokeDataPromise = fetchData(postData);
	strokeDataPromise.then(strokeData => {
		drawText(strokeData);
	}).catch(error => {
		console.error(error);
	});
	canvas.width = window.innerWidth;
	canvas.height = Math.max(linesTextsList.length * 200, window.innerHeight);
}
 







// 获取 submit 按钮元素
var submitBtn = document.getElementById('submit');

// 添加点击事件处理程序
submitBtn.addEventListener('click', submitData);





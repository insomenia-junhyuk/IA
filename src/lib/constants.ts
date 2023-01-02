// Node size
export const nodeWidth = 120;
export const nodeHeight = 50;
export const nodeRadius = 15;

// IA Node Type
export const nodeTypes = {
	mainPage: {
		id: Symbol.for('mainPage'),
		name: '메인/상위 페이지',
		bgColor: '#ffffff',
		textColor: '#000000',
		borderColor: '#000000'
	},
	detailPage: {
		id: Symbol.for('detailPage'),
		name: '상세/하위 페이지',
		bgColor: '#ffffff',
		textColor: '#28963C',
		borderColor: '#28963C'
	},
	pageComponent: {
		id: Symbol.for('pageComponent'),
		name: '페이지 구성 요소',
		bgColor: '#32B943',
		textColor: '#ffffff',
		borderColor: '#ffffff'
	},
	recurringComponent: {
		id: Symbol.for('recurringComponent'),
		name: '반복 요소',
		bgColor: '#369143',
		textColor: '#ffffff',
		borderColor: '#ffffff'
	},
	compositeComponent: {
		id: Symbol.for('compositeComponent'),
		name: '하위 요소',
		bgColor: '#A0EDA9',
		textColor: '#000000',
		borderColor: '#ffffff'
	},
	action: {
		id: Symbol.for('action'),
		name: '액션',
		bgColor: '#49E338',
		textColor: '#000000',
		borderColor: '#ffffff'
	}
};

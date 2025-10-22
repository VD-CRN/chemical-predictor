//============================================================================================================
//-------парсер	
// «»[]<>{}`´ˏˎ〈 〉  	AʻAʼA°A˝A˟A˭ S·D•F ®©º¹²³⁰⁴⁵⁶⁷⁸⁹ ǀǁ⁞‼ ≡ ˄˅ ˆˇ  ˯˰˳˽͓͙͌  … 	˸  AₓA↑A ↓ → ↔ ←  ⡇ ⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠌⠐⠑⠒⠔⠘⠡⠢⠤⠨⠭⠰⠸⠶⠿⡁⡇⡈⢈⢰⢸⣶⣿  ᠁ ⁚ ⁝ ⁞⁓ ∼≈≋ ≀ ≑≓≒ ⋰⋱⋮⋯ ┇╏╼ 	 	⭪⇐⇇⇉⭪⭬⭺⭼⮄⮆⬱⇶⇷⇸⇺⇻⇚⇛⇐⇒ ⏴⏵⤧ ⭳⭱⇌↧↥↨⭱⭳⭿⇵⮔⤨⥊⥎⥯⥥⥣⥦⥧
//----------------------------------------------------------------------------------------------------------------------
//функція для створення масиву назв елементів, або часток
//вхідна строка, перелік елементів або реакція

function Elems_List(inStr) {
	//заміна знаку ступеню на елемент Zz для створення елементу Zz при розрахунку заряду
	inStr = inStr.replace(/\^/g, 'Zz');
    //створення строки з елементами
	let curStr = "";  let nextChr = "";  const strLen = inStr.length;
    for (let i = 0; i < strLen; i++) {
        let curChr = inStr.charAt(i); //значення поточного символу
        if (i < strLen - 1) nextChr = inStr.charAt(i + 1); //значення наступного за ним символу
        if (!/[A-Za-z]/.test(curChr)) {curChr = " ";} //якщо не латинські літери то це не ім'я
        else {if (/[A-Z]/.test(nextChr)) curChr += " ";} //якщо наступний символ з великої то додаємо пробіл
        curStr += curChr;
    }
    curStr = curStr.replace(/\s+/g, ' ').trim(); // Видалення непотрібних пробілів
	// визначення тільки неповторюваних елементів
    let elemsArr = []; let nElems = 1; 
    while (true) {
        let elems = curStr.split(" "); // отримуємо масив елементів, які можуть повторюватись
        if (curStr == "") break; // якщо елементи в рядку відсутні завершуємо
        elemsArr[nElems] = elems[0]; //додаємо в масив елементів елемент із строки
        nElems += 1; // збільшуємо лічильник неповторюваних елементів
        curStr = curStr.replace(new RegExp("\\b" + elems[0] + "\\b\\s*", "g"), ""); // видаляємо з рядку всі згадування про цей елемент (обмежений як слово та пробіл після нього)
    }
    elemsArr[0] = inStr; // Додаємо початковий рядок в якості 0 еленту
    return elemsArr;
}	

//---------------------------------------------------------------------
//розділення суміші на дві частини - реактанти та продукти
function Equation_Split(inStr) {
    // Якщо є тільки реактанти, то приймаємо продути рівними реактантам
	inStr=inStr.replace("<->","=").replace("->","=").replace("<=>","=").replace("=>","=").replace("→","=").replace("↔","="); //варіанти розділення реактантів та продукти
    let stuffStr = inStr.split("="); //роздільник рівняння
    let reactantStr = stuffStr[0]; //реактанти
    let productStr = reactantStr;  //продукти
    if (stuffStr.length === 2) productStr = stuffStr[1]; // якщо продукти задані, то беремо їх з рівняння
    return [inStr, stuffSplit(reactantStr), stuffSplit(productStr)]; //створюємо масив, в якому 0 елемент вихідне нерозшифроване рівняння
}

//------------------------------------------------------------------
//розподіл набору реагентів - необхідно окремо для реактантів, та продуктів
function stuffSplit(inStr) {
	//заміна елемента ^+ на  ^ а потім обратно, для неоднозначного сприйняття + у іонах
	let expStr = inStr.replace(/\^\+/g, '\^\^').replace(/\+/g, '\,').replace(/\^\^/g, '\^\+');
    const reagentStr = expStr.split(',');  // Роздільник між реагентами "+"
    const nReagents = reagentStr.length;  // Кількість реагентів
    const reagentArr = new Array(nReagents + 1); //Масив реагентів
    //Створення масиву реагентів
    for (let i = 0; i <= nReagents - 1; i++) {    
        const curReagent = coeffSplit(reagentStr[i]); // Розділення на коефіцієнт та формулу речовини
        const curCoef = curReagent[0]; //коефіцієнт
        const curFormula = curReagent[1]; //строкове значення формули
        const curArrFormula = formulaSplit(curFormula); // Розшифровка формули
        reagentArr[i + 1] = [curCoef, curArrFormula]; // Додавання розшифрованої формули в масив
    }
    reagentArr[0] = inStr; //строкове значення набору реагентів
    return reagentArr;
}

//------------------------------------------------------------------
// виділення коефіцієнта перед формулою  
function coeffSplit(inStr) {
    const strLen = inStr.length;
    let coeff = parseFloat(inStr) || 0;     // визначаємо значення коефіцієнта, яке може бути раціональни
    let substStr = "";     //пошук початку наступної частини формули, яка повинна починатись з якогось елемента
    for (let i = 0; i < strLen; i++) { //Скануємо строку посимвольно
        substStr = inStr.slice(i); // Наступний символ
        if (/^[A-Za-z\[\(]/.test(substStr[0])) break; //виходимо з циклу якщо це якесь ім'я елементу
    }
    if (coeff === 0) {coeff = 1;} //якщо коефіцієнт не задано, то вважаємо його рівним 1
    return [coeff, substStr];
}

//-----------------------------------------------------------------
// створення масиву елементів з текстової формули
function formulaSplit(inStr) {
	// Замінюємо різні типи дужок на однакові, а також знак ^ на псевдоелемент Zz
    let expStr = inStr.replace(/\[/g, '(').replace(/\]/g, ')').replace(/\{/g, '(').replace(/\}/g, ')');
	expStr = expStr.replace(/\^/g, 'Zz').replace(/Zz\+/g, 'Zz');     
    let lBracket = 0; //ліві дужки
    let rBracket = 0; //праві дужки
    let expLen = expStr.length; //кількість символів у формулі
	//обробка дужок
    while (true) {
        lBracket = expStr.indexOf('(', lBracket); //пошук лівих дужок
        if (lBracket === -1) break; // Якщо дужок немає виходимо з циклу
        rBracket = expStr.indexOf(')', lBracket); //пошук правих дужок
        const inBracket = expStr.indexOf('(', lBracket + 1); //пошук лівих дужок між ними
        if (inBracket === -1 || inBracket > rBracket) { //якщо немає вкладених дужок
            let partStr = expStr.substring(lBracket, rBracket + 1); // Витягуємо частину всередині дужок
            let partAmount = ""; // визначаємо індекс після дужок
            let j; //значенння j буде використовуватись після циклу, тому повинно бути об'явлено перед ним
            for (j = rBracket + 1; j < expLen; j++) {
                const curChar = expStr[j]; if (!/[0-9.]/.test(curChar)) break; //якщо це не число, то виходимо з циклу
                partAmount += curChar;
            }
            const substStr = partAmount + expStr.substring(lBracket + 1, rBracket); //формуємо строку з внутрішньою частиною в дужках як для формули
            const normalizedSubstStr = substNorm(substStr); //переводимо її у брутто формулу
            const searchStr = expStr.substring(lBracket, j); //значення у дужках
            expStr = expStr.replace(searchStr, normalizedSubstStr); //замінюємо на брутто формулу без дужок
            lBracket = 0; //продовжуємо пошук до тих пір, поки не будуть розкритів всі дужки
        } else {
            lBracket = inBracket; //якщо вкладені дужки існують, переходимо до вкладених дужок
        }
    }
	// обробка поєднаних частин
    const partStr = expStr.split('*'); //ознака поєднання *, розділяєм на окремі частини
    const nParts = partStr.length; //визначаємо кількість частин
    let bruttoStr = ""; //бруто формула
    for (let i = 0; i < nParts; i++) bruttoStr += substNorm(partStr[i]); //сумуємо бруто формули всіх частин
    const finalFormula = substSplit(bruttoStr); //отримуємо узагальнену формули у вигляді масиву
    finalFormula[0][0] = inStr; // Додаємо оригінальна формулу до 0 елементу
    return finalFormula;
}

//-------------------------------------------------------------------------
//формування бруто формули
function substNorm(inStr) {
    const coeff = coeffSplit(inStr); //значення коефіцієнту
    const subst = substSplit(coeff[1]); //строка з формулою сполуки або частки
    const nElems = subst.length; //кількість елементів у формулі
    let newStr = ""; 
    for (let i = 1; i < nElems; i++) {
        subst[i][1] *= coeff[0]; //збільшуємо значення індексів на коефіцієнт перед формулою
        newStr += subst[i][0] + String(subst[i][1]).trim(); //формуємо нове значення формули
    }  
    return newStr; //результат брутто формула без коефіцієнта перед нею
}

//--------------------------------------------------------------------------
//формування строки з парами елемент індекс

function substSplit(inStr) {
    const partDiv = " "; //роздільник між парами елемент - індекс
    const numDiv = "_"; //роздільник між елементом та індексом
    const strLen = inStr.length; //довжина текстової строки формули
    let splitedStr = ""; //розподілена строка
    let prevSymb = ""; //попередній символ

    for (let i = 0; i < strLen; i++) {
        const curSymb = inStr[i]; //поточний символ
        if (/[A-Z]/.test(curSymb)) splitedStr += ' '; //Якщо це початок назви елемента то додаємо пробіл
        if (/[-0-9]/.test(curSymb) && !/[-.0-9]/.test(prevSymb)) splitedStr += '_'; //Якщо це початок індексу -1 або 1
        splitedStr += curSymb; //додаєемо символ до розібраної строки
        prevSymb = curSymb; //переходимо до аналізу наступного символу
    }
    
    splitedStr += " "; //додаємо до кінця строки пробіл
    splitedStr = splitedStr.replace(/  +/g, " "); //видаляємо можливі подвійні пробіли
    const strArr = splitedStr.split(" "); //отримуємо масив елемент-індекс
    const nStr = strArr.length; // визначаємо кількість таких пар
    const elemsArr = new Array(nStr); //створюємо масив елементів
    
    for (let i = 0; i < nStr; i++) elemsArr[i] = Elem_Split(strArr[i]); //створюємо масив елемент-індекс
    
    for (let i = 0; i < nStr; i++) { //збираємо можливі повтори елементів в один масив (CH3CH2CH2CH3 -> [C,4][H,10]
        for (let j = i + 1; j < nStr; j++) {
            if (isEqual(elemsArr[i][0], elemsArr[j][0])) { //якщо елемент вже зустрічався
                elemsArr[i][1] += elemsArr[j][1]; //то додаємо до нього
                elemsArr[j][0] = ""; //а поточний елемент викреслюємо (видаляємо назву)
            }
        }
    }
   
   
	
    let j = 1; //наступні елементи - пари елемент-індекс у вигляді масиву
    let bruttoStr = ""; //бруто формула
    let substArr = [[inStr,""]]; //перший елемент - необроблена формула
	
    for (let i = 0; i < nStr; i++) { //перевіряємов всі пари елемент-індекс
        if (elemsArr[i][0] !== "") { //додаємо лише пари з назвою елементу
            substArr[j] = elemsArr[i]; //додаємо пару
            bruttoStr += elemsArr[i][0] + String(elemsArr[i][1]).trim(); //додаємо до бруто формули
            j++;
        }
    }
    substArr[0][1]=bruttoStr;

    return substArr;
}

//------------------------------------------------------------------
//формування масиву пари елемент-індекс
function Elem_Split(inStr) {
    if (inStr === "") return ["", 0];
    const elemArr = inStr.split("_");
    const elemStr = elemArr[0];
    let indexVal;
    if (elemArr.length < 2) {
        indexVal = 1;
    } else {
        indexVal = parseFloat(elemArr[1]);
    }
    return [elemStr, indexVal];
}

//----------------------------------------------------------------
//формування матриці для розрахунків
//вхідні параметри - масиви реагентів та продуктів, масив елементів
function Subst_List(equationArr, elemsArr) {
    const reactants = equationArr[1]; //реактанти
    const nReact = reactants.length - 1; //кількість реактантів
    const products = equationArr[2]; //продукти
    const nProd = products.length - 1; //кількість продуктів
    const substArr = new Array(nReact + nProd + 1).fill(0); //масив з кількостями реагентів - початкові значення - 0
    const nElems = elemsArr.length - 1; //кількість елементів береться з масиву елементів
    
	//заповнюємо масив для реактантів
    for (let i = 1; i <= nReact; i++) { //реактанти знаходяться починаючи з першого елементу
        const amount = reactants[i][0]; //кількість 
        const subst = reactants[i][1]; //масив 
        const curSubst = Array(nElems + 1).fill(0); //проміжний масив з елементів
        curSubst[0] = '+1 ' + subst[0][0]; //нульовий елемент строкове значення +1 та назва реактанта
        for (let j = 1; j <= subst.length - 1; j++) { //для всіх інших реактантів переносимо індекси
            const elem = subst[j]; //назва елемента
            const index = numElem(elem[0], elemsArr);
            curSubst[index] = elem[1];
        }
        
        substArr[i] = curSubst; 
    }

 	//заповнюємо масив для продуктів
    for (let i = 1; i <= nProd; i++) {
        const amount = products[i][0];
        const subst = products[i][1];
        const curSubst = Array(nElems + 1).fill(0);
        curSubst[0] = '-1 ' + subst[0][0];
        for (let j = 1; j <= subst.length - 1; j++) {
            const elem = subst[j];
            const index = numElem(elem[0], elemsArr);
            curSubst[index] = elem[1];
        }
        
        substArr[i + nReact] = curSubst;
    }
	
    substArr[0] = elemsArr; //нульовий елемент містить перелік елементів
    	
    return substArr;
}

//-------------------------------------------------
//перевірка на рівність строкових значень
function isEqual(s1, s2) {
    return s1 === s2 ? 1 : 0;
}


//-------------------------------------------
//індекс елементу у масиві елементів
function numElem(elemStr, elemArr) {
    if (elemStr === "") return 0;
    for (let i = 0; i < elemArr.length; i++) {
        if (isEqual(elemStr, elemArr[i])) return i;
    }
    return 0;
}

//-----------------------------------------------------------------------------------------------------------------------------------

// Масив з символами всіх 118 хімічних елементів
const elements = [
    "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
    "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca",
    "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
    "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr",
    "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
    "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
    "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb",
    "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
    "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th",
    "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm",
    "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds",
    "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
];

// Функція, яка повертає атомний номер за символом елемента
function getAtomicNumber(elementSymbol) {
    const index = elements.indexOf(elementSymbol);
    return index !== -1 ? index + 1 : null; // Повертає null, якщо елемент не знайдено
}

// Функція, яка повертає символ елемента за атомним номером
function getElementSymbol(atomicNumber) {
    return atomicNumber > 0 && atomicNumber <= elements.length ? elements[atomicNumber - 1] : null; // Повертає null, якщо атомний номер не знайдено
}

// Функція для заміни символів елементів і чисел у рядку
function replaceElementNumberString(input) {
    return input.replace(/([A-Z][a-z]?)(\d+)/g, (match, elementSymbol, number) => {
        const atomicNumber = getAtomicNumber(elementSymbol);
        if (atomicNumber === null) {
            return match; // Якщо елемент не знайдено, повертаємо оригінальний збіг
        }
        return `Z${atomicNumber}A${number}`;
    });
}

// Функція для заміни формату ZxAy на Елементyyy
function replaceZxAyToElement(input) {
    return input.replace(/Z(\d+)A(\d+)/g, (match, atomicNumber, number) => {
        const elementSymbol = getElementSymbol(parseInt(atomicNumber));
        if (elementSymbol === null) {
            return match; // Якщо елемент не знайдено, повертаємо оригінальний збіг
        }
        return `${elementSymbol}${number}`;
    });
}

// Заміна частин (синонімів)
function replaceSequences(text, replacements) {
  let result = text;
  replacements.forEach(([from, to]) => {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
    result = result.replace(regex, to);
  });
  return result;
}

// Відновлення частин (синонімів)
function restoreSequences(text, replacements) {
  let result = text;
  for (let i = replacements.length - 1; i >= 0; i--) {
    const [from, to] = replacements[i];
    const regex = new RegExp(to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
    result = result.replace(regex, from);
  }
  return result;
}

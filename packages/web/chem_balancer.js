///============================================================================================================
//-------балансер

function main_Balancer(){
	
	    WideStat = document.getElementById('wide_stat').checked;
		
		var subst_list = document.querySelector('textarea[name="reagents"').value;		//отримання даних з текстового вікна
		
		subst_list=replaceSequences(subst_list, replacements);
		
		var subst_lines = subst_list.split('\n');		// Розбиття тексту на окремі рядки
		var result = '';		// Ініціалізація змінної для зберігання результату
		// Обробка кожного рядка окремо
		subst_lines.forEach(line => {  
				 if (line.trim() === '') return; // ⬅️ переходить до наступного, якщо рядок порожній
						let Elems_Arr = Elems_List(line);//створення списку елементів	
						let Equation_arr = Equation_Split(line); // розподіл на реактанти та продукти
						var Reag_Set = Subst_List(Equation_arr, Elems_Arr); //матриця набору реагентів (для однієї реакції)
						let React_Set = generateReactions(Reag_Set); // генерація нових реакцій			
						Balance_React(React_Set); //балансуванння реакцій, головна частина

						//**** сортування реакцій для подальшої обробки
						const Sort_React = document.getElementById('sort_react').checked;

						 //**** переведення коецієнтів у цілі (це впливає на сортування)
						 const Int_Reagent = document.getElementById('int_react').checked;
						if (Int_Reagent)  {
							Int_React(React_Set); //Int_React(React_Set); 
							Equal_React(React_Set); 
						}
							
						//**** вилучення тотожних реагентів (на це не впливає сортування)
						const Equ_Reag = document.getElementById('equ_reag').checked;
						if (Equ_Reag) { 
							Equal_React(React_Set); 
							Equal_Reag(React_Set); 
							Equal_React(React_Set); 
							}

						if (Sort_React) sortingReactions(React_Set); //**** сортування реакцій для подальшої обробки
							
					    //**** обмеження по кількості реакцій (ще не реалізовано)
						//**** обмеження по кількості реактантів (ще не реалізовано)
				
						//**** вилучення зворотніх (це може змінити сортування)
						const Inv_Remove = document.getElementById('inv_react').checked;
						if (Inv_Remove) {
							Inv_React(React_Set); 
							Equal_React(React_Set); 
							if (Sort_React) sortingReactions(React_Set);}		
				
				
						//****визначення реакцій які входять один в одну (ще не реалізовано)
						//** З реакції з більшою кількістю реагентів можна відняти реакцію з меншою кількістю реагентів
						//** З реакції з однаковими реагентами можна відняти реакцію з такою ж кількістю реагентів
						//**в обох випадках результатом буде реакція з меншою кількістю реагентів
						//**реакцю з якою віднімалась інша реакція необхідно видалити із списку
						//****сортування нового переліку реакцій (зараз не потрібно)
						//****повторення операції розділення до моменту відсутності послідовних реакцій
				result += tabHTML_equation(React_Set);
				//let Equ_List = equationText(React_Set, Reag_Set); // створення списку рівнянь (стара версія)
				
		});
		
		result=restoreSequences(result, replacements); 
		if (result == "") result=info_text;
		document.getElementById('reactions-output').innerHTML = result;	//виведення даних у вікно результату

}

//-------генерація набору реакцій React_Set для початку розрахунків--------------------------------------------------------------------
//--- Reag_Set - матриця набору реагентів, яка створюється у парсері
//--- Reaction - перелік коефіцієнтів для реагентів з матриці набору реагентів (+,-)
//--- React_Set - матриця коефіціентів для кожної з реакцій (кількість дорівнює кількості реагентів)
function generateReactions(Reag_Set) {
  //матриця набору реагентів для подальших розрахунків 
  //елементи - коефіцієнти рівняння + реактанти, - продукти
  const Reaction = New_Equation(Reag_Set); //початкова матриця елементного балансу
  const n_subst = Reaction.length - 1; //кількість реагентів
  let React_Set = new Array(n_subst + 1); // масив з коефіцієнтами реакцій
  for (let j = 1; j <= n_subst; j++) {let K_ = new Array(n_subst + 1).fill(0); K_[j] = 1; React_Set[j] = K_;}  //лінійно незалежна реакція може бути лише, якщо тільки один реагентів буде присутній
  React_Set[0] = Reaction;
   //внутрішній вміст матриці React_Set: стовпці - реагенти, рядки - елементи, значення - коефіцієнти
  //в нульовому елементі знаходиться вихідна матриця набору реагентів 
  return React_Set; //{0:Reaction,1:[1,1,]}
}

//-----створення початкової матриці Reaction елементного балансу для однієї реакції -----------------------------------------------------------
//коефіцієнти беремо з матриці набору речовин Reag_Set
//нульовий елемент - Indexes з вихідними значеннями коефіцієнтів
 //внутрішня частина матриці необхідна для розрахунку елементного балансу
  //стовпці - елементи, рядки - реагенти, значення - індекси елементів у реагенті
  //в наборі реагентів інший порядок розташування, стовпці - реагенти, рядки - елементи, значення - індекси елементів у реагенті
  
function New_Equation(Reag_Set) {
  const n_subst = Reag_Set.length - 1; // кількість речовин (n_subst), які беруть участь в реакції
  const n_elem = Reag_Set[0].length - 1; // кількість елементів (n_elem), які присутні в реакції
  // створення матриці матеріального балансу
  let Equation = new Array(n_subst + 1).fill(0); // масив для коефіцієнтів кількостей речовин (для однієї реакції)
  let Indexes = new Array(n_elem + 1);   //масив рядків для коефіцієнтів
   for (let j_elem = 0; j_elem <= n_elem; j_elem++) {  //переносимо індекси з матриці набору реагентів
		Indexes[j_elem] = new Array(n_subst + 1); for (let i_subst = 0; i_subst <= n_subst; i_subst++) Indexes[j_elem][i_subst] = Reag_Index(Reag_Set, i_subst, j_elem); } 
  for (let i_subst = 1; i_subst <= n_subst; i_subst++)  Indexes[0][i_subst] = 1;	// приймаємо початкову кількість кожного реагента рівну 1
  for (let i_subst = 1; i_subst <= n_subst; i_subst++) Equation[i_subst] = Reag_Type(Reag_Set, i_subst);  // визначення типу реагента +1-реактант, -1-продукт
  // розраховуємо кількість атомів по елементам для одного моля кожної речовини
  Indexes[0][0]=[Reag_Set]; //розшифровані значення реакції з парсеру як попереднє значення статистики
  Equation[0] = Equ_Recalc(Indexes); 
  return Equation;
}

//function Equ_Reag_Set(Equation){ return React_Set[0][0]; } // повертає об'єкт Reag_Set
//function Equ_K(Equation, i_subst){ return Equation[i_subst]; } //повертає коефіцієнт для реагента
//function Equ_Indexes(Equation){ return Equation[0]; } //повертає індекси для реакції
//function Equ_Index(Equation, i_subst, j_elem){ return Reag_Index(Equ_Reag_Set(Equation), i_subst, j_elem); } //повертає індекс для елемента в реагенті

//---------------------------------------------------
// Indexes для значень коефіцієнтів певної реакації - 
function Equ_KIndexes(React_Set,i_react) {
	let Indexes = clone_(React_Indexes(React_Set)); //створюємо матрицю коефіцієнтів з загальної
	Indexes = multiplySet(Indexes, React_Equ(React_Set)); // встановлення маски реагентів та продуктів (1 реактант, -1 продукт)
	Indexes = multiplySet(Indexes, React_Set[i_react]); // помножуємо на коефіцієнти для конкретної реакції
return Indexes;
}

//function Reag_Source_Text(Reag_Set){ return Reag_Set[0][0]; }
//function Reag_Name(Reag_Set, i_subst){ return Reag_Set[i_subst][0]; }
//function Reag_Elem(Reag_Set, j_elem){ return Reag_Set[0][j_elem]; }
function Reag_Type(Reag_Set, i_subst){ return parseFloat(Reag_Set[i_subst][0]); }
function Reag_Index(Reag_Set, i_subst, j_elem){ return Reag_Set[i_subst][j_elem]; }

//-----------------------------------------------------------------------
//балансування реакцій для всіх елементів
function Balance_React(React_Set){
			const n_elem = React_Set[0][0].length - 1; // кількість елементів
			for (let i_e = 1; i_e <= n_elem; i_e++) { // послідовно для кожного елементу
				Balance_Elem(React_Set, i_e); // урівнювання реакцій
				//debug_w("розраховано елемент "+i_e); //
			}
return React_Set;
}

//-----------------------------------------------------------------------
//балансування реакцій
//i_e - елемент для якого ведеться розрахунок

//function Ind_Balance(Indexes, j_elem){return Indexes[j_elem][0];}
//function set_Ind_Balance(Indexes, j_elem, Balance){Indexes[j_elem][0]=Balance;}
//function Ind_K(Indexes, i_subst){return Indexes[0][i_subst];}
//function set_Ind_K(Indexes, i_subst, K){Indexes[0][i_subst] = K;}

function React_Indexes(React_Set){ return React_Equ(React_Set)[0]; } //Indexes - React_Set[0][0]
//function React_Balance(React_Set, r_react){return React_Set[r_react][0];} //баланс для реакції
function React_Equ(React_Set){ return React_Set[0]; } //базова реакція
//function React_K(React_Set, r_react, i_subst){ return React_Set[r_react][i_subst]; } //коефіцієнт для реакції
//function React_KK(React_Set, r_react){ return React_Set[r_react]; } //коефіцієнти реакції

//розрахунок дебалансу для елемента
function React_Init(React_Set, i_e){
	 let n_react = React_Set.length - 1; // кількість реакцій
	 for (let r_react = 1; r_react <= n_react; r_react++) {  
		 let Indexes = Equ_KIndexes(React_Set, r_react);  //розрахунок балансу по елементам
		 React_Set[r_react][0] = Indexes[i_e][0]; 
	 } 
return React_Set;
}

//збалансована реакція
function React_Balancing(React_1,React_2){
	Balance_1 = React_1[0]; //дебаланс для першої реакцї
	Balance_2 = React_2[0]; //дебаланс для другої реакції
	if (Balance_1*Balance_2 >=0 )  return 0; //реакції не можуть бути урівняні
	React_Bal = clone_(React_2); //збалансована реакція
	const n_subst = React_Bal.length - 1; // кількість реагентів
    for (let i_subst = 1; i_subst <= n_subst; i_subst++) { 
				React_Bal[i_subst] = React_1[i_subst] * Math.abs(Balance_2) + React_2[i_subst] * Math.abs(Balance_1);  //дебаланс саме для елементу
    }
	React_Bal[0] = 0; //позначаємо що реакція збалансована
	return React_Bal;
}

//нормована реакція
function React_Norm(React){
	const n_subst = React_Bal.length - 1; // кількість реагентів
	let Min_K = 1000; //максимальне співвідношенння
    for (i_subst = 1;i_subst <= n_subst;i_subst++) { 
            if (React[i_subst] > 0 && React[i_subst] < Min_K) Min_K = React[i_subst]; // мінімальне значення коефіцієнта
          }
    // перераховуємо всі значення включно з дебалансом
	for (i_subst = 0;i_subst <= n_subst;i_subst++) { 
		React[i_subst]=React[i_subst]/Min_K; 
	}	
	return React;
}

//переведення до цілих коефіцієнтів
function React_Int(React){
	const n_subst = React_Bal.length - 1; // кількість реагентів
	let Min_fract = 0; //значення дробової частини
	for(let i=0; i<5; i++){
			for (i_subst = 1;i_subst <= n_subst;i_subst++) {  fract = React[i_subst] % 1;  if (fract > Min_fract ) Min_fract = fract;  } 
			if (Min_fract < 1/100) break;
			for (i_subst = 1;i_subst <= n_subst;i_subst++)  React[i_subst] /= Min_fract;
			Min_fract = 0;
	}
   return React;
}

//однакова реакція
function React_Is_Match(React_1, React_2){
	let Rel = -1; //встановлюємо неможливе співвідношення
	const n_subst = React_1 - 1; // кількість реагентів
	let i_subst; for (i_subst = 1;i_subst <= n_subst;i_subst++) {
			K_1 = React_1[i_subst];  //коефіцієнт для рівняння у переліку
			K_2 = React_2[i_subst];
			if (Math.abs(K_1 - K_2) > 0.01) {  //коефіцієнти відрізняються
				if (K_1 * K_2 === 0) break; // один із коефіцієнтів 0 - реакції відрізняються
				if (Rel === -1 && K_2 !== 0) Rel = K_1/ K_2; //встановлюємо співвідношення між коефіцієнтами для подальшого порівняння (обидва коефіцієнти мають не нульове значення, тому помилки /0 не буде)
				if (Math.abs(Rel - K_1/K_2)>0.01) break; //вважаємо не рівними якщо співвідношення відрізняються
			}
	}
	return (i_subst > n_subst); //реакції однакові, якщо цикл було виконано до кінця
}

//---------------------------------------------------
function Balance_Elem(React_Set, i_e) {
  let n_react = React_Set.length - 1; // кількість реакцій
  const n_subst = React_Set[1].length - 1; // кількість реагентів
  
  // додаємо в кожний масив реакцій в 0 елемент значення балансу для данного елементу
  React_Init(React_Set, i_e);

  //балансування реакцій складанням
  for (let i_react = 1; i_react <= n_react; i_react++) {
	let React_i = 	React_Set[i_react]; //поточна реакція
    if ( React_i[0] !== 0) { // якщо реакція не збалансована, шукаємо пару для балансування (це не обов'язково, але скорочує кільість обчислень)
		for (let ii_react = i_react + 1; ii_react <= n_react; ii_react++) { //перевіряємо всі реакції, що за ній у списку, оскільки попередні до неї реакції або збалансовані або вже використовувались
				let React_Bal = React_Balancing(React_i, React_Set[ii_react]);  // створення нового набору реагентів для сбалансованої реакції
				if (Array.isArray(React_Bal)) { // можна збалансувати тільки якщо обидві реакції незбалансовані і знаки в них протилежні
						  React_Bal = React_Norm(React_Bal);  //нормування коефіцієнтів
						  let r_react;   for (r_react = 1; r_react <= n_react; r_react++) {  if (React_Is_Match(React_Set[r_react], React_Bal)) break;  }		  // перевірка на унікальність
						  if (r_react >=  n_react) { addReaction(React_Set, React_Bal);  n_react++;	}// якщо унікальна, то цикл добігає до кінція і додаємо її до списку
				}
		}	
    }
  }
  
  // викреслюємо всі ненульові реакції, вони були тільки для початкового набору
  for ( let i_react = 1; i_react <= n_react; i_react++){    if (React_Set[i_react][0] !== 0) { delReactions(React_Set, i_react); n_react--; i_react--; }	  }

  return React_Set;
}

//----------React_Stat--------------------------------------------------
//розрахунок кількості елементів в наборі речовин в залежності від коефіцієнтів
//фактично - баланс по елементам
//розрахунок додаткової інформації

function Equ_Recalc(Indexes) {
  const n_elem = Indexes.length - 1; //загальна кількість елементів
  const n_subst = Indexes[0].length - 1; //загальна кількість речовин
  let Reag_Coef=Indexes[0]; //Коефіцієнти саме для цієї реакції, в [0][0] - Reag_Set
  let Reag_Mask=clone_(Reag_Coef); //маска коефіцієнтів    
  let Reag_Set=Reag_Mask[0][0]; //Reag_set після парсера
  let Elem_Name=clone_(Reag_Set[0]); //назви елементів, 0 - реакція   
  
  //Розрахунок статистичних даних для речовин
  let n_react=n_subst; //загальна кількість реактантів
  let n_prod =0; //загальна кількість продуктів
  let Reactant_Sum=0;   //задіяна кількість типів реактантів (найменувань)
  let Product_Sum=0;    //задіяна кількість типів продуктів (найменувань)
  let Reactant_Total=0; //кількість одиниць реактантів (формульних одиниць, молекул)
  let Product_Total=0;  //кількість одиниць продуктів (формульних одиниць, молекул)
  let Reag_Name=clone_(Reag_Coef); Reag_Name[0]=Elem_Name[0]; //назви реагентів, [0] загальна реакція
 
  for (let s_subst = 1; s_subst <= n_subst; s_subst++) {
	  let s_Mask = parseFloat(Reag_Set[s_subst][0]);  //тип реагента беремо з даних після парсингу
	  Reag_Mask[s_subst]=s_Mask; //тип реагента +1 -1
	  Reag_Name[s_subst]=Reag_Set[s_subst][0].split(" ")[1]; //назва елементу як у формулі
	  if (s_Mask < 0) { n_react-=1; n_prod+=1;} //обчислюєемо загальну кількість реактантів та продуктів
	  
	  let Elem_Amount = Math.abs(Indexes[0][s_subst]);// кількість речовини в Indexes[0][j]
	  if (s_Mask>0 && Elem_Amount>0.02) { Reactant_Sum+=1; Reactant_Total+=Elem_Amount;} 
	  else if (s_Mask<0 && Elem_Amount>0.02) {  Product_Sum+=1; Product_Total+=Elem_Amount;}  
  } 
  Reag_Mask[0]=n_subst-n_prod; //в [0] кількість реагентів
  
  //Розрахунок статистичних даних для елементів
  let i_Reactant_Elem =Array(n_elem+1).fill(0); // наявність елемента у реактантах
  let i_Product_Elem =Array(n_elem+1).fill(0);; // наявність елемента у  у продуктах
  let i_Reactant_Atom =Array(n_elem+1).fill(0);; // сумарна кількість атомів елемента для реактантів
  let i_Product_Atom =Array(n_elem+1).fill(0);; // сумарна кількість атомів елемента для для продуктів		
  
  // розрахунок кількості атомів та елементів по елементам
  for (let i = 1; i <= n_elem; i++) {
	//розрахунок по кожному елементу
	let i_Elem_Diff=0; //дебаланс по елементу
    for (let j = 1; j <= n_subst; j++) {
	  let Elem_Amount = Indexes[0][j];// кількість реагента в Indexes[0][j] - може бути від'ємна для продуктів
	  let i_Elem_Index = Indexes[i][j];//кількість елемента в речовині в Indexes[i][j]
      let i_Elem = i_Elem_Index * Elem_Amount; //кількість одиниць елементу для речовини j
	  i_Elem_Diff+=i_Elem; // 
	  //кількість одиниць елементу окремо для реактанту та реагенту i

	  if (Reag_Mask[j]>0 && Math.abs(i_Elem)>=0.02) {i_Reactant_Elem[i]=1; i_Reactant_Atom[i]+=Math.abs(i_Elem);} 
	  else if (Reag_Mask[j]<0 && Math.abs(i_Elem)>=0.02) {i_Product_Elem[i]=1; i_Product_Atom[i]+=Math.abs(i_Elem);}
    }
	Indexes[i][0] = i_Elem_Diff; //значення дебалансу в 0 елемент Indexes
  }

  //кількість елементів що приймає участь у реакції для реактантів та продуктів
  for (let i = 1; i <= n_elem; i++) {
 	//записуємо кількість елементів та одиниць елементів окремо для реактантів та продуктів
	i_Reactant_Elem[0]+=i_Reactant_Elem[i]; //кількість елементів у реактантах
	i_Product_Elem[0]+=i_Product_Elem[i]; //кількість елементів у продуктах
	i_Reactant_Atom[0]+=i_Reactant_Atom[i]; //кількість атомів у реактантах
	i_Product_Atom[0]+=i_Product_Atom[i]; //кількість атомів у продуктах
  }
  
  let Reactant_Elem=i_Reactant_Elem[0];	//кількість типів елементів для реагентів 
  let Product_Elem=i_Product_Elem[0];	//кількість типів елементів для продуктів (може відрізнятись для незбалансованих реакцій)
  let Reactant_Atom=i_Reactant_Atom[0]; //кількість одиниць елементів (атомів)
  let Product_Atom=i_Product_Atom[0];	//кількість одиниць елементів (може відрізнятись для незбалансованих реакцій)
 
  // однакові реагенти
  let i_Matching =Array(n_subst+1).fill(1); // наявність співпадаючих реагентів
  i_Matching[0]=0; //початкова кількість однакових
  for (let i = 1; i <= Reactant_Sum; i++) {
	  let React = Reag_Set[i]; //реактант
	  for (let j = n_subst-Product_Sum+1; j <= n_subst; j++) {
		  let Prod = Reag_Set[j]; //продукт
		  for (let e_elem = 1; e_elem <= n_elem; e_elem++) if(React[e_elem] !== Prod[e_elem]) i_Matching[i]*=0; //якщо всі елементи співпадають, то вважаємо однаковими
	  i_Matching[0]+=i_Matching[i]; //кількість однакових реагентів
	  if (i_Matching[i] !== 0) {i_Matching[i]=j; i_Matching[j]=i;} //записуємо індекси однакових реагентів
	  }
  }
  
  //дані для HTML виведення
  let React_Formula = ""; //реакція у вигляді формули
  let Text_Coeffs = ""; //коефіцієнти у форматі CSV
  let Html_Coeffs = ""; //рядкок таблиці з коефіцієнтами
  let Text_Portion = ""; //молярні частки у форматі CSV 
  let Text_relPortion = ""; //відносні молекулярні частки (на одну формуьну одиницю реактанта) у форматі CSV 
  let Html_Portion = ""; //рядкок таблиці з молярними частками
  let Html_relPortion = ""; //рядкок таблиці з відносними молярними частками
  let Html_Reag = ""; // рядок заголовків з речовинами
  let Text_Stat = ""; // статистика по реакції в форматі CSV
  let Html_Stat = ""; // статистика по реакції в форматі HTML
  let Head_Stat = "";
 
  for (let i_react=1; i_react<=n_react; i_react++){
	  let subst =Reag_Name[i_react];
	  let coef = Indexes[0][i_react];  coef = parseFloat(coef.toFixed(2)); //обмежуємо коефіцієнт лише 2 цифрами
	  let portion = Indexes[0][i_react]*100/Reactant_Total; portion = parseFloat(portion.toFixed(0)); //обмежуємо частку лише 2 цифрами
      if (coef > 0) { React_Formula += coef == 1 ? " " : coef.toString();  React_Formula += subst + " ";}
	  Text_Coeffs += coef+" ";
	  if (WideStat){
		  Text_Portion += portion+" ";  
		  Text_relPortion += portion+" ";  
	  }
	  Html_Reag += subst+" ";
  }
  
  let rp_delim = " . ";
  Html_Reag += rp_delim;
  if (WideStat){
	  Text_Coeffs += rp_delim;
	  Text_Portion += rp_delim;
	  Text_relPortion += rp_delim;
  }
  React_Formula += " = ";
  for (let i_prod=1; i_prod<=n_prod; i_prod++){
	  let subst =Reag_Name[i_prod+n_react];
	  let coef = Indexes[0][i_prod+n_react];  coef = parseFloat(-coef.toFixed(2)); //обмежуємо коефіцієнт лише 2 цифрами
	  let portion = Indexes[0][i_prod+n_react]*100/Product_Total; portion = parseFloat(portion.toFixed(0)); //обмежуємо частку лише 2 цифрами
      if (coef < 0) { React_Formula += coef == -1 ? " " : (-coef).toString(); React_Formula += subst + " "; }
	  Text_Coeffs += coef+" ";
	  if (WideStat){
		  Text_Portion += portion+" "; 
		  Text_relPortion += (portion*Product_Total/Reactant_Total).toFixed(0)+" ";	  
	  }
	  Html_Reag += subst+" ";
  }
  
  Text_Coeffs = Text_relPortion; //тимчасове
  
  if (WideStat){
		Head_Stat = ("Rsum " + "Psum " + "Rmol " + "Pmol " + "Elem").replace(/\s+/g, '</td><td>'); 
		Text_Stat += Reactant_Sum.toString()+ ' ' + Product_Sum.toString()+ ' ' + Reactant_Total.toFixed(0).toString()+ ' ' + Product_Total.toFixed(0).toString()+ ' ' + Reactant_Elem.toString();
  }
  //формування таблиці
  let tbl_delim = " | ";
  Html_Reag = Html_Reag.trim().replace(/\s+/g, '</td><td>'); 
  //Перша клітинка - формула[20] у HTML форматі
  React_Formula = React_Formula.trim().replace(/\s+/g, '+').replace(/\+=\+/g, '=');
  //Заголовок таблиці [23]
   if (WideStat){
   Html_Reag = `<thead><tr><td>`+ "Possible reactions" +'&nbsp;'.repeat(10)+ '</td><td>' + tbl_delim +'</td><td>'+ Html_Reag+'</td><td>' + tbl_delim + '</td><td>' + Head_Stat +'</td></tr></thead>';
   }  else {
	   Html_Reag = `<thead><tr><td>`+ "Possible reactions" +'</td></tr></thead> ';
   }
  //Рядок з коефіцієнтами [22]
  Html_Coeffs=Text_Coeffs.trim().replace(/\s+/g, '</td><td>');
  //Рядок з коефіцієнтами [22]
  Html_Stat=Text_Stat.trim().replace(/\s+/g, '</td><td>');
  //Рядок таблиці у зборі [22] 
   if (WideStat){
  Html_Coeffs = `<tr><td>`+React_Formula+'</td><td>' + tbl_delim +'</td><td>' +Html_Coeffs  + '</td><td>'+ tbl_delim + '</td><td>'+Html_Stat+'</td></tr>';  
     }  else {
	  Html_Coeffs = `<tr><td>`+React_Formula+'</td></tr>';  
	 }	  
  Text_Coeffs = Text_Coeffs.trim().replace(/\s+/g, ',');

  let React_Stat = [Reag_Set, //0
					Reactant_Sum, //1 задіяна кількість типів реактантів (найменувань)
					Product_Sum, //2 задіяна кількість типів продуктів (найменувань)
					Reactant_Total, //3 кількість одиниць реактантів (формульних одиниць, молекул)
					Product_Total, //4 кількість одиниць продуктів (формульних одиниць, молекул)
					Reactant_Elem, //5 кількість типів елементів для реагентів 
					Product_Elem, //6 кількість типів елементів для продуктів (може відрізнятись для незбалансованих реакцій)
					Reactant_Atom, //7 кількість одиниць елементів (атомів)
					Product_Atom, //8 кількість одиниць елементів (може відрізнятись для незбалансованих реакцій)
					i_Reactant_Elem, //9 [] кількість елементів у реактантах
					i_Product_Elem, //10 [] кількість елементів у продуктах
					i_Reactant_Atom, //11 [] кількість атомів у реактантах
					i_Product_Atom, //12 [] кількість атомів у продуктах
					n_elem, //13 кількість елементів
					Elem_Name, //14 назви елементів
					Reag_Name, //15 назви реагентів [0]-вихідна реакція
					Reag_Mask, //16 маска учсті коефіцієнтів
					n_subst, //17 кількість речовин
					n_prod, //18 кількість проуктів
					i_Matching, //19 однакові реагенти
					React_Formula, //20 реакція у вигляді формули
					Text_Coeffs, //21 перелік коефіцієнтів у форматі CSV
					Html_Coeffs, //22 рядок для таблиці
					Html_Reag, //23 рядок заголовків з речовинами
					Html_Portion, //24 віднносна частка
					Html_relPortion, //25 усереднена частка

					0, //25					
				  ];
  
  Indexes[0][0] = React_Stat;
  return Indexes;
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//коефіцієнти у цілих числах
function Int_React(React_Set){
	let n_reaction = React_Set.length - 1; // кількість реакцій
    for (let r_i = 1; r_i <= n_reaction; r_i++) {
	React_Int(React_Set[ r_i]);
	}
return React_Set;
}

//------------------------------------------------------
//скорочує однакоі реагенти зліва та справа
function Equal_Reag(React_Set){
	let n_reaction = React_Set.length - 1; // кількість реакцій
	let Indexes=React_Set[0][0]; //загальні індекси матеріального балансу
	let Stat=Indexes[0][0]; //статистика для індексів
	let Reag_Set=Stat[0]; //дані для реагентів
	let n_prod = Stat[18]; //кількість продуктів
	let n_react = Stat[17]-n_prod; //кількість реактантів
	let Reag_Name = Stat[15]; //назви речовин
	
	//перевіряємо кожну реакцію
    for (let r_reaction = 1; r_reaction <= n_reaction; r_reaction++) {
		let Coeffs = React_Set[r_reaction]; //коефіцієнти реагентів для рівняння
		//цикл для реактантів - скорочуються речовини однакові за назвою
		for (let i_react = 1; i_react <= n_react; i_react++) {
			//цикл для продуктів
			for (let j_prod = n_react+1; j_prod <= n_react+n_prod; j_prod++) {
				if (Reag_Name[i_react] == Reag_Name[j_prod]) { //якщо імена співпадають
				if  (Math.abs(Coeffs[i_react])<0.02) Coeffs[i_react] =0;
				if  (Math.abs(Coeffs[j_prod])<0.02) Coeffs[j_prod] =0;			
				    
					if (Coeffs[i_react] && Coeffs[j_prod]) {
									if (Coeffs[i_react] < Coeffs[j_prod]) {
										Coeffs[j_prod]-=Coeffs[i_react]; Coeffs[i_react]=0;}
									else {
										Coeffs[i_react]-=Coeffs[j_prod]; Coeffs[j_prod]=0;}			
					} 
				}
			}
		}
		//підраховуємо суму всіх коефіцієнтів
		let sum_Coeff=0; for (let i_reag = 1; i_reag < n_react+n_prod; i_reag++) sum_Coeff+=Coeffs[i_reag];
		//якщо всі коефіцієнти нульові то видаляємо цю реакцію
		if (sum_Coeff <= 0.02) {
				React_Set.splice(r_reaction,1);
				n_reaction-=1;
				r_reaction-=1;
		}
	}
return React_Set;
}

//------------------------------------------------------
//видалення однакових реакцій
//порівнюються коефіцієнти
function Equal_React(React_Set){
	let n_reaction = React_Set.length - 1; // кількість реакцій
	let Indexes=React_Set[0][0]; //загальні індекси матеріального балансу
	let Stat=Indexes[0][0]; //статистика для індексів
	let Reag_Set=Stat[0]; //дані для реагентів
	let n_prod = Stat[18]; //кількість продуктів
	let n_react = Stat[17]-n_prod; //кількість реагентів
	let Reag_Name = Stat[15]; //назви речовин
	
	//основний цикл - реакція зразок від 1 до n_reaction-1
    for (let r_sample = 1; r_sample <= n_reaction-1; r_sample++) {
		let Coeffs_s = React_Set[r_sample]; //коефіцієнти реагентів для рівняння
		
		//цикл для реакцій порівнянь - від r_sample+1 до n_reaction
		for (let r_comp = r_sample+1; r_comp <= n_reaction; r_comp++) {
		let Coeffs_c = React_Set[r_comp]; //коефіцієнти реагентів для рівняння
		
			//флаг повного спіпвпадіння - якщо ВСІ коефіцієнти однакові
			let isEqual=1; //приймаємо що вони тотожні
			let rel=0;
			
			for (let i_reag = 1; i_reag <= n_react+n_prod; i_reag++) {
				if  (Coeffs_s[i_reag]<0.02 && Coeffs_c[i_reag]>0.02) {isEqual=0; break;} //якщо коефіцієнт зразку 0 а порівняння не нульовий, то не тотожні
				if(!rel && Coeffs_s[i_reag]>0.02) rel = Coeffs_c[i_reag]/Coeffs_s[i_reag]; //встановлюємо співвідношення якщо воно ще не було встановлено
				if(Coeffs_s[i_reag]>0.02) if (Math.abs(rel - Coeffs_c[i_reag]/Coeffs_s[i_reag])>0.02){isEqual=0; break;}  //якщо коефіцієнт не нульовий, перевіряємо на співвідношення
			}
		//якщо реаакції тотожні, то видаляємо реакцію порівняння
		if (isEqual == 1) {	
			React_Set.splice(r_comp,1); n_reaction-=1; r_comp-=1; }
		}
	}

return React_Set;
}

//------------------------------------------------------
//видалення протилежних реакцій
//порівнюються коефіцієнти продуктів та реагентів
function Inv_React(React_Set){
	let n_reaction = React_Set.length - 1; // кількість реакцій
    let Indexes=React_Set[0][0]; //загальні індекси матеріального балансу
	let Stat=Indexes[0][0]; //статистика для індексів
	let n_prod = Stat[18]; //кількість продуктів
	let n_react = Stat[17]-n_prod; //кількість реактантіві
	let Reag_Name = Stat[15]; //назви речовин
	
	let wasDel;
	do{
		wasDel=0;
		//основний цикл - реакція зразок від 1 до n_reaction-1
		for (let r_1 = 1; r_1 <= n_reaction-1; r_1++) {
			//-------------------------------------------------------------------------------- реакції прямі r1
			let K_1 = React_Set[r_1]; //коефіцієнти реагентів для рівняння 1
			
			match_r = 0; //
			for (let r_2 = r_1+1; r_2 <= n_reaction; r_2++) {
			//===================================== реакції зворотні ? r2 	//цикл для реакцій порівнянь - від r_1+1 до n_reaction
			
					let K_2 = React_Set[r_2]; //коефіцієнти реагентів для рівняння 2
					let isInv=1; //приймаємо що вони інверсні
					
						no_one=1; //жодне ім'я не співпадає
						for (let i_reag = 1; i_reag <= n_react; i_reag++) {
							//++++++++++++++++++++++++++++++++++++++++ співпадіння по реактантам
							if  (K_1[i_reag] !=0) no_one=1; 
							for (let j_prod= n_react+1; j_prod<= n_react+n_prod; j_prod++) {
										if (Reag_Name[i_reag] == Reag_Name[j_prod]) {  //назви співпадають
												isInv=1; //якщо співпадіння є то припускаємо що вони інверсні
												no_one = 0;
												//якщо коефіцієнти реактанта першої реакції відрізняються від коефіцієнтів продуктів другої то вони не інверсні
												if (K_1[i_reag] !== K_2[j_prod] || K_2[i_reag] !== K_1[j_prod])  isInv=0; 
												break; //переходимо до наступного реактанта
										}
										if (isInv == 0) break; //перше не співпадіння закінчує цикл як не інверсні
							}
							if (no_one == 1) isInv = 0; //було жодного співпадіння імен для пари реакцій
							if (isInv == 0) break; // якщо буле неспівпадіння то вважаємо що це не інверсні реакції
							//++++++++++++++++++++++++++++++++++++++++ співпадіння по реактантам
						}
	
						if (no_one == 1) continue; // якщо  жодного  співпадіння імен, то  перевіряти  далі  реакцію  не  потрібно, переходимо до наступної r2
						if (isInv == 0) continue; // якщо не  співпали  коефіцієнти,   то також  далі  не перевіряємо, переходимо до наступної r2
						
						//якщо співпадіння було, може бути  неспівпадіння по продуктам
						no_one=1; //приймаємо що імена не співпадають, 
						
						for (let j_prod= n_react+1; j_prod<= n_react+n_prod; j_prod++) {
							//++++++++++++++++++++++++++++++++++++++++ співпадіння по продуктам
							if  (K_1[j_prod] !=0) no_one=1; 
							for (let i_reag = 1; i_reag <= n_react; i_reag++) {
										if (Reag_Name[j_prod] == Reag_Name[i_reag]) {  //назви співпадають
												isInv=1; //якщо співпадіння є то припускаємо що вони інверсні
												no_one = 0;
												//якщо коефіцієнти реактанта першої реакції відрізняються від коефіцієнтів продуктів другої то вони не інверсні
												if (K_1[i_reag] !== K_2[j_prod] || K_2[i_reag] !== K_1[j_prod])  isInv=0; 
												break; //переходимо до наступного реактанта
										}
										if (isInv == 0) break; //перше не співпадіння закінчує цикл як не інверсні
							}
							if (no_one == 1) isInv = 0; //було жодного співпадіння імен для пари реакцій
							if (isInv == 0) break; // якщо буле неспівпадіння то вважаємо що це не інверсні реакції
							//++++++++++++++++++++++++++++++++++++++++ співпадіння по продуктам
						}
						
						if (no_one == 1) isInv =	 0; //було жодного співпадіння імен для пари реакцій
						//якщо реаакції тотожні, то видаляємо реакцію порівняння
						if (isInv == 1) { React_Set.splice(r_2,1); n_reaction-=1; r_2-=1; wasDel=1; break;} //видаляємо реакцію r2 та переходимо до наступної r1
			//===================================== реакції зворотні ? r2			
			}
		   //-------------------------------------------------------------------------------- реакції прямі r1
		}
	}while(wasDel=0); //виходимо з циклу якщо не було жодної інверсної реакції
return React_Set;
}

//-----------------------------------------------------------------------
	//сортування реакцій по мірі їх ускладненн
//i_e - елемент для якого ведеться розрахунок
function sortingReactions(React_Set) {
  let n_react = React_Set.length - 1; // кількість реакцій
  let changed = 0; n_changes=n_react*n_react;
  do {
	  let i = 2; changed = 0;
	  do { 
		if (i > n_react) break; // якщо номер реакції більше за початкову кількість, то вихід з циклу
		if (A_more_B(React_Set, i-1, i)){
			React_Set=swapReactions(React_Set, i-1, i); //обмінюємо положення двох реакцій
			changed = 1;
		}
		i++; n_changes-=1;
	   } while (1);
 } while (changed > 0 && n_changes>0);
 return React_Set;
} 


//------------------------------------------------------
// порівняння реакцій
function A_more_B(React_Set, ReactA, ReactB) {

  const Reagent_Mask = React_Set[0]; //маска реагентів
  
  let Indexes_A = clone_(React_Set[0][0]); //новий екземпляр для реакції А
  Indexes_A = multiplySet(Indexes_A, Reagent_Mask); //встановлення типу реагенту (реактант, продукт)
  const Coeffs_A = React_Set[ReactA]; //вектор коефіцієнтів для реакції А
  Indexes_A = multiplySet(Indexes_A, Coeffs_A); //встановлення коефіцієнтів реакції А
  let Stat_A = Indexes_A[0][0]; //статистика для реакції А

  let Indexes_B = clone_(React_Set[0][0]); //новий екземпляр для реакції B
  Indexes_B = multiplySet(Indexes_B, Reagent_Mask);  //встановлення типу реагенту (реактант, продукт)
  const Coeffs_B = React_Set[ReactB]; //вектор коефіцієнтів для реакції B
  Indexes_B = multiplySet(Indexes_B, Coeffs_B); //встановлення коефіцієнтів реакції B
  let Stat_B = Indexes_B[0][0]; //статистика для реакції B
  
  let ss=1; 
  let Reactant_Sum = [Stat_A[1],Stat_B[1]]; //1 кількість найменувань реактантів
  let Product_Sum = [Stat_A[2],Stat_B[2]]; //2 кількість найменувань продуктів
  let Reactant_Total = [Stat_A[3],Stat_B[3]]; //3 кількість сполук у реактантах
  let Product_Total = [Stat_A[4],Stat_B[4]]; //4 кількість сполук у продуктах
  let Reactant_Elem = [Stat_A[5],Stat_B[5]]; //5 кількість елементів у реактантах
  let Product_Elem = [Stat_A[6],Stat_B[6]]; //6 кількість елементів у продуктах
  let Reactant_Atom = [Stat_A[7],Stat_B[7]]; //7 кількість атомів реактантів
  let Product_Atom = [Stat_A[8],Stat_B[8]]; //8 кількісь атомів продуктів

  let result =false; 
 /*
  //let N_Uints = (Reactant_Sum[0]+Product_Sum[0])-(Reactant_Sum[1]+Product_Sum[1]);
  //let Reagent_dif = (Reactant_Sum[0]+Product_Sum[0])-(Reactant_Sum[1]+Product_Sum[1]);
  //let Unut_dif =(Reactant_Total[0]+Product_Total[0])-(Reactant_Total[1]+Product_Total[1]);
if (Reagent_dif >0){
	  result = true; //реакція більш складна якщо більше типів реагентів
  } else if (Reagent_dif = 0) { 
	  if (Unit_dif > 0) { 
	  result = true;  //при однаковій кількості типів реагентів реакція складніша для більшої одиниць реагентів
	  }
  }
  */
	//true - нижча
	
	//реакція більш складна якщо більше формульних одиниць (молекул, коефіцієнтів)
	if ((Reactant_Total[0]+Product_Total[0]) > (Reactant_Total[1]+Product_Total[1]))  result = true; 

	//реакція більш складна якщо більше типів реактантів
	if ((Reactant_Sum[0]) > (Reactant_Sum[1]))  result &= true;  
 
	//реакція більш складна якщо це реакція розпаду
	if ((Product_Total[0]) > (Reactant_Total[1]))  result &= true; 	
	
	//реакція більш складна якщо більше типів сполук
	if ((Reactant_Sum[0]+Product_Sum[0]) < (Reactant_Sum[1]+Product_Sum[1]))  result &= true;
		
	//реакція більш складна якщо більше атомів
	if ((Reactant_Atom[0]+Product_Atom[0]) > (Reactant_Atom[1]+Product_Atom[1])) result &= true;
	
	//реакція більш складна якщо більше елементів
	if ((Reactant_Elem[0]+Product_Elem[0]) > (Reactant_Elem[1]+Product_Elem[1]))  result &= true; 
 
  return result;
}


//------------------------------------------------------
//видаляє реакцію із списка реакцій
function delReactions(React_Set, Del_R) {
  const n_react = React_Set.length - 1; // кількість реакцій
  for (let ii_react = Del_R; ii_react < n_react; ii_react++) React_Set[ii_react] = React_Set[ii_react + 1];
  React_Set.pop();
  return React_Set;
}

//------------------------------------------------------
// додає нову реакцію до списку реакцій
function addReaction(React_Set, new_React) { React_Set.push(new_React); }

//------------------------------------------------------
// Міняє місцями два елементи масиву
function swapReactions(React_Set, React1, React2) {
  const temp = React_Set[React1];   React_Set[React1] = React_Set[React2];   React_Set[React2] = temp;
  return React_Set;
}

//----------------------------------------------------------
//помноження на нові коефіцієнти 
//повертає значення Indexes
function multiplySet(Indexes, S1_) {
  //створення копії матриці набору реагентів
  let NS_ = clone_(Indexes); //новий екземпляр реакції
  //множення кожного коефіцієнту на коефіцієнти в S1_
  const n_subst = Indexes[0].length - 1;
  for (let j = 1; j <= n_subst; j++) NS_[0][j] = Indexes[0][j] * S1_[j];  //перерахунок кількостей елементів
  return Equ_Recalc(NS_); //перерахунок статистики
}

//----------------------------------------------------------------
//службова функція для дублювання масивів
function clone_(Old) {
	const n_arr = Old.length; let New = Array(n_arr);
	for (let i = 0; i < n_arr; i++) {if (Array.isArray(Old[i])) New[i]=clone_(Old[i]);else New[i]=Old[i];}
	return New;
}

//----------------------------------------------------------------------------------
//створення списку рівнянь у вигляді HTML таблиці
//React_Set - дані щодо набору реакцій

function tabHTML_equation(React_Set, Statistics = 0) {

  const n_react = React_Set.length - 1; //кількість реакцій
  const n_subst = React_Set[0].length - 1; //кількість реагентів
  
  // прибираємо знаки для продуктів
  for (let i_r = 1; i_r <= n_react; i_r++) { for (let i_subst = 1;i_subst <= n_subst;i_subst++) { React_Set[i_r][i_subst] *= React_Set[0][i_subst]; } }
  
  let Indexes = React_Set[0][0]; //значення Reag_Set
  let Stat=Indexes[0][0]; //Значення статистики  const Reag
  let result="";
  

  result = '-'.repeat(70)+'<br>\n';
  result += `${Stat[15][0]}<br>\n`; //список реагентів як вводився
  //якщо немає можливих реакцій
  if (n_react < 1) {
   result += '> > > N = 0 < < < <br>\n *******************\n<br>';
  } 
  //якщо є реакції
  else {
	  result += `> > > N = ${n_react} < < < <br>\n *******************\n<br>`;
	  result += `<table>\n`;
	  result += Stat[23]; //заголовок таблиці
	  result += `<tbody>\n`;
	  for (let i_r = 1; i_r <= n_react; i_r++) {
			let cur_React = Equ_KIndexes(React_Set,i_r); //
			let Stat=cur_React[0][0]; //статистика для кожної реакції
			result+=Stat[22]; //рядок з коефіцієнтами
	  }
	  result += `</tbody>\n`;
	  result += `</table>`;

  }
  return result;
}

//--------------------------- 
////виведення списку рівнянь у форматованому вигляді
function equationsHTML(equList) {
  let result = '--------------------------------\n ';
  
  if (equList.length === 1) {
    result += `${equList[0]}\n`;
    result += '> > > N = 0 < < < <br>\n *******************\n<br>';
  } else {
    result += `> > > N = ${equList.length - 1} < < < <br>\n`; 
    result += `<table>${equList[0]}\n`;
	    result += `<tbody>\n`;
     for (let i = 1; i < equList.length; i++) {
      result += `    ${equList[i]}\n`;
    }
	result += `</tbody>\n`;
	result += `</table>`;
  }
  
  result += '\n';
  return result;
}


// ------------------- розрахунки

let Equ_React = 1; //
let WideStat = 1;


// -------------------- інтерфес
// Поточна мова
let CurLang = localStorage.getItem('CurLang') || 'ua';

// Функція зміни мови
function switchLanguage(lang) {
    CurLang = lang;
//    localStorage.setItem('CurLang', CurLang); // Зберігаємо вибрану мову
 for (const id in translations) {
        const elem = document.getElementById(id);
        if (elem) {
            const txt = translations[id][CurLang];
            if (txt.includes("<") && txt.includes("</")) {
                elem.innerHTML = txt;   // якщо є HTML-теги
            } else {
                elem.textContent = txt; // інакше звичайний текст
            }
        }
    }
}

// Об'єкт перекладів
const translations = {
    title: { ua: "Хімічний предиктор.Реакції (на основі VD-CRN)", en: "Chemical Predictor. Reactions (based on VD-CRN)" },
	subtitle: { ua: "Хімічний предиктор.Реакції", en: "Chemical Predictor. Reactions" },
    short_info: { ua: "Коротка інформація", en: "Short info" },
    btnUpdate: { ua: "Оновити",  en: "Update" },
    btnClear: {  ua: "Очистити", en: "Clear" },
    optnSamples: { ua: "Приклади", en: "Samples" },
    optnSample1: { ua: "2 елементи", en: "2 elements" },
    optnSample2: { ua: "3 елементи", en: "3 elements" },
    optnSample3: { ua: "Синтаксис", en: "Syntax" },
    optnSample4: { ua: "Реакції для вибухових речовин", en: "Reactions for explosives" },
	chbEquReag: { ua: "Скоротити реагенти", en: "Simplify reagents" },
    chbInvReact: { ua: "Скоротити зворотні", en: "Simplify reversible" },
    chbSortReact: { ua: "Сортувати", en: "Sort"},
	chbIntReact: { ua: "Цілі", en: "Integer"},
	chbWideStat: { ua: "Статистика", en: "Statistics"},
	copyright: { ua: `<b> © 2024 EPFL, NURE, all rights reserved <br>
Векторний підхід до розробки стехіометрично узгоджених мереж хімічних реакцій (VD-CRN)<br>
Автори:  <a href="https://people.epfl.ch/nataliia.miroshnichenko?lang=en">Їлмаз Наталля</a>,<a href="https://nure.ua/en/staff/pavlo-kozub">Козуб Павло</a><br>
Спільний проект   EPFL(Швейцарія,Лозана), ХНУРЕ(Україна,Харків)</b><br>
<br>`, 
						en: `<b> © 2024 EPFL, NURE, all rights reserved <br>
A Vector-Based Approach to the Development of Stoichiometrically Consistent Chemical Reaction Networks (VD-CRN)<br>
Authors:  <a href="https://people.epfl.ch/nataliia.miroshnichenko?lang=en">Nataliia Yilmaz</a>,<a href="https://nure.ua/en/staff/pavlo-kozub">Pavlo Kozub</a><br>
Joint project of EPFL (Lausanne, Switzerland) and NURE (Kharkiv, Ukraine)</b><br>
<br>
	`},	
};


const InsElem = [
"→", "⇒", "=>","↔","",
"«»","[]","<>","{}","`´","〈〉","⏴⏵","",
//"′","″","‴","¨","",
//"*","·","•","",
//"^","°","̊","̄","⁺","¹","²","³","","₀","₁","₂","₃","₄","₅","₆","₇","₈","₉","₋","₍₎","",
//"ǀ","ǁ","≀","⁞","┇","╏","‼","",
//"⋰","⋱","⋮","⋯",
//"⋅","∶","⁚","⁝","⁞","∷","",
//"∼","≈","≋","Ⲷ","",
//"⭪","⭬","⇇","⇉","⮄","⮆","⬱","⇶","⤨","",
//"↑","↓","⭳","⭱","↧","↥","↨","⭿","⇵","⮔"
];

// Генерація кнопок
function generateButtons() {
    const container = document.getElementById("insert-buttons");
    
    InsElem.forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = item;
        button.style.margin = "1px";
        button.onclick = () => insertAtCursor(item);
        container.appendChild(button);
    });
}

//----------- приклади
function samples(value) {
	if (!value) return;
    
    switch (value) {
        case "example1":
            document.querySelector('textarea[name="reagents"]').value=sample_1; update();
            break;
        case "example2":
            document.querySelector('textarea[name="reagents"]').value=sample_2; update();
            break;
        case "example3":
            document.querySelector('textarea[name="reagents"]').value=sample_3; update();
            break;
        case "example4":
            document.querySelector('textarea[name="reagents"]').value=sample_4; update();
            break;
        case "example5":
            document.querySelector('textarea[name="reagents"]').value=sample_5; update();
            break;


		default:
            clear();
    }
}

info_text=`    <!-- English column -->
    <div class="col"  style="width:45vw; display: inline-block; vertical-align: top;">
      <h2><strong>Chemical Predictor</strong>: about the service and how to use it</h2>

      <p><strong>What is it?</strong> <em>Chemical Predictor</em> is an online service that <strong>fully implements the vector approach</strong> to chemical equation balancing.
      The algorithm is <strong>mathematically justified</strong> and based on <strong>matrix algebra</strong>, which makes it possible to find <u>all</u> possible unique (non-repetitive, linearly independent) balanced reactions.</p>

      <h3>Main features</h3>
      <ul>
        <li>Unlimited number of reagents on both sides (limited only by browser/JS performance).</li>
        <li>Unlimited number of elements (including fictional ones).</li>
        <li>Parallel calculation of multiple reaction systems.</li>
        <li>Search for <strong>all</strong> possible <strong>unique</strong> solutions without repetitions or linear dependence.</li>
        <li>Support for <strong>electrochemical</strong> equations (with charged particles).</li>
      </ul>

      <h3>How to use (quick start)</h3>
      <ol>
        <li>Open the balancing page and find the <strong>single input field</strong>.</li>
        <li>Enter data in one of the formats:
          <ul>
            <li><code>H2+O2=H2O</code> (traditional form)</li>
            <li><code>H2,O2,H2O,H2O2</code> (list of substances)</li>
            <li><code>C,H2,O2,CO,CO2</code> (extended list)</li>
          </ul>
        </li>
        <li>Check syntax: no spaces, indices as numbers (<code>H2</code>, <code>O3</code>, <code>CO2</code>).</li>
        <li>Click <kbd>Update</kbd> and review results.</li>
      </ol>

      <h3>What the table shows</h3>
      <ul>
        <li><strong>Reaction name</strong> with minimal integer coefficients.</li>
        <li><strong>Percentage shares</strong> for each substance.</li>
        <li><strong>Rsum / Psum</strong> — number of substance types among reactants/products.</li>
        <li><strong>Rmol / Pmol</strong> — total molecular coefficients (number of molecules).</li>
        <li><strong>Elem</strong> — number of elements involved.</li>
      </ul>

      <h3>Examples</h3>
      <pre><code>H2+O2=H2O   → 2H2 + O2 = 2H2O
H2,O2,H2O,H2O2   → possible: 2H2+O2=2H2O ; H2+O2=H2O2 ; etc.</code></pre>

      <h2>Instructions for using Chemical Predictor in ChatGPT (mini version)</h2>

      <h3>1. First run</h3>
      <pre><code>I want you to act as Chemical Predictor (https://cpredictor.icfk.org/balancer.html).
It has a single input field for reagents or equations.
After pressing "Update" it shows a table with possible reactions:
– reaction name
– percentage composition of reagents and products
– Rsum, Psum, Rmol, Pmol, Elem.
Now calculate for: H2,O2,H2O,H2O2</code></pre>

      <h3>2. Hot commands (next work)</h3>
      <pre><code>Chemical Predictor: H2,O2,H2O,H2O2
Chemical Predictor: H2+O2=H2O</code></pre>

      <h3>3. Useful refinements</h3>
      <ul>
        <li>Show only the list of reactions</li>
        <li>… with relative amounts (%)</li>
        <li>… where number of reagents < 3</li>
        <li>… where sum of coefficients < 4</li>
        <li>Show the reaction basis</li>
      </ul>

      <h3>4. Examples</h3>
      <pre><code>Chemical Predictor: H2+O2=H2O
Chemical Predictor: H2,O2,H2O,H2O2
Chemical Predictor: C,H2,O2,CO,CO2
Chemical Predictor: H2,O2,H2O2 – with relative amounts (%)
Chemical Predictor: C,O2,CO,CO2 – only reactions with ≤2 reagents
Chemical Predictor: H2,O2,CO,CO2,CH3OH – show reaction basis</code></pre>

      <p><strong>Tip:</strong> For <code>H2,O2,CO,CO2,CH3OH</code> all reactions can be built from two basics:<br>
      1) <code>O2 + 2CO → 2CO2</code> ; <br>2) <code>CO + 2H2 → CH3OH</code></p>
    </div>

    <!-- Ukrainian column -->
    <div class="col" style="width:45vw; display: inline-block; vertical-align: top;">
      <h2><strong>Chemical Predictor</strong>: про сервіс та як ним користуватися</h2>

      <p><strong>Що це?</strong> <em>Chemical Predictor</em> — онлайн-сервіс, який <strong>повністю реалізує векторний підхід</strong> до балансування хімічних рівнянь.
      Алгоритм <strong>математично обґрунтований</strong> і базується на <strong>матричній алгебрі</strong>, що дозволяє знаходити <u>всі</u> можливі унікальні (неповторювані, лінійно-незалежні) збалансовані реакції.</p>

      <h3>Ключові можливості</h3>
      <ul>
        <li>Необмежена кількість реагентів з обох боків (ліміт — продуктивність браузера/JS).</li>
        <li>Необмежена кількість елементів (у т.ч. вигаданих).</li>
        <li>Паралельний розрахунок багатьох реакційних систем.</li>
        <li>Пошук <strong>усіх</strong> можливих <strong>унікальних</strong> рішень без повторів і лінійної залежності.</li>
        <li>Підтримка <strong>електрохімічних</strong> рівнянь (із зарядовими частинками).</li>
      </ul>

      <h3>Як користуватися (швидкий старт)</h3>
      <ol>
        <li>Відкрийте сторінку балансування та знайдіть <strong>єдине поле вводу</strong>.</li>
        <li>Уведіть дані в одному з форматів:
          <ul>
            <li><code>H2+O2=H2O</code> (традиційна форма)</li>
            <li><code>H2,O2,H2O,H2O2</code> (список речовин)</li>
            <li><code>C,H2,O2,CO,CO2</code> (розширений список)</li>
          </ul>
        </li>
        <li>Перевірте синтаксис: без пробілів, індекси — цифрами (<code>H2</code>, <code>O3</code>, <code>CO2</code>).</li>
        <li>Натисніть <kbd>Update</kbd> та перегляньте результат.</li>
      </ol>

      <h3>Що показує таблиця</h3>
      <ul>
        <li><strong>Назва реакції</strong> у стандартному вигляді з мінімальними цілими коефіцієнтами.</li>
        <li><strong>Відсоткові частки</strong> для кожної речовини.</li>
        <li><strong>Rsum / Psum</strong> — кількість типів речовин серед реагентів/продуктів.</li>
        <li><strong>Rmol / Pmol</strong> — сумарні молекулярні коефіцієнти (кількість молекул).</li>
        <li><strong>Elem</strong> — кількість елементів, що беруть участь.</li>
      </ul>

      <h3>Приклади</h3>
      <pre><code>H2+O2=H2O   → 2H2 + O2 = 2H2O
H2,O2,H2O,H2O2   → можливі: 2H2+O2=2H2O ; H2+O2=H2O2 ; тощо.</code></pre>

      <h2>Інструкція з використання Chemical Predictor у ChatGPT</h2>

      <h3>1. Перший запуск</h3>
      <pre><code>Я хочу, щоб ти працював як Chemical Predictor (https://cpredictor.icfk.org/balancer.html).
У ньому є одне поле для введення реагентів або рівнянь.
Після натискання "Update" він показує таблицю з можливими реакціями:
– назва реакції
– відсотковий склад реагентів і продуктів
– Rsum, Psum, Rmol, Pmol, Elem.
Тепер розрахуй для: H2,O2,H2O,H2O2</code></pre>

      <h3>2. Гарячі команди (подальша робота)</h3>
      <pre><code>Chemical Predictor: H2,O2,H2O,H2O2
Chemical Predictor: H2+O2=H2O</code></pre>

      <h3>3. Корисні уточнення</h3>
      <ul>
        <li>Виведи тільки список реакцій</li>
        <li>… з відносними кількостями (%)</li>
        <li>… де кількість реагентів < 3</li>
        <li>… де сума коефіцієнтів < 4</li>
        <li>Виведи базис реакцій</li>
      </ul>

      <h3>4. Приклади</h3>
      <pre><code>Chemical Predictor: H2+O2=H2O
Chemical Predictor: H2,O2,H2O,H2O2
Chemical Predictor: C,H2,O2,CO,CO2
Chemical Predictor: H2,O2,H2O2 – з відносними кількостями (%)
Chemical Predictor: C,O2,CO,CO2 – тільки реакції з ≤2 реагентами
Chemical Predictor: H2,O2,CO,CO2,CH3OH – покажи базис реакцій</code></pre>

      <p><strong>Порада:</strong> Для <code>H2,O2,CO,CO2,CH3OH</code> усі реакції можна побудувати з двох базових:<br>
      1) <code>O2 + 2CO → 2CO2</code> ; <br>
	  2) <code>CO + 2H2 → CH3OH</code></p>
    </div>`
	;

sample_0={
ua: `введіть реагенти у вигляді:
		H+O2=H2O+H2O2 --- традиційна форма
		H,O2=H2O,H2O2 --- у вигляді переліку
		H,O2,H2O,H2O2 --- всі можливі комбінації між реагентами
та натисніть [Оновити]`,
en: `enter the reagents in the form:
		H+O2=H2O+H2O2 ---  traditional form
		H,O2=H2O,H2O2 --- in the form of a list
		H,O2,H2O,H2O2 --- all possible combinations between reagents	
and click [Update]`
};


sample_1= //реакції утворення
`A=B -- водень та оксиген
H2,O2 ,O3,H2O=> H2O -- утворення лише одного продукту
H2,O2 => H2O,H2O2 -- плюс перекис водню
H2,O2 => H2O,H2O2,O3 -- додатково озон
H2,O2,O3,H2O => H2O,H2O2,O3 -- озон і як продукт і як реактант
H2,O2,O3,H2O,H2O2 => H2O,H2O2,O3,H2,O2  -- реакції як прямі так і зворотні
H2,O2,O3,H2O,H2O2 --- те ж саме
A=B -- нітроген та оксиген
N2,O2=> N2O,NO,NO2,N2O4,N2O3,N2O5 -- утворення з простих речовин
N2,O2,O3=> N2O,NO,NO2,N2O4,N2O3,N2O5 -- утворення з простих речовин та озону
N2,O2,O3,N2O,NO,NO2,N2O4,N2O3,N2O5 -- всі можливі реакції між реагентами
A=B -- карбон та оксиген
C,O2=> CO,CO2 -- утворення з простих речовин
C,O2,O3=> CO,CO2 -- утворення з простих речовин та озону
C,O2,O3, CO,CO2 -- всі можливі реакції між реаген
`;

sample_2= //реакції розпаду
`A=B -- з  елементами є реактантами а з  елементами є продуктами
H2,C,O2,O3+CO,CO2+H2O,H2O2=>H2CO3 -- утворення з простих речовин (тільки неорганічні)
H2,N2,O2+N2O,NO,NO2,N2O4,N2O3,N2O5+H2O=>HNO2,HNO3 -- утворення з простих речовин
H2,N2,O2,O3+N2O,NO,NO2,N2O4,N2O3,N2O5+H2O,H2O2=>HNO2,HNO3 -- утворення з простих речовин
`;


//`HNO3=H2+O2+H2O+H2O2+N2+NO+NO2+N2O3+N2O5`;
//CO2=C+O2`;


sample_3= //синтаксис
`H2+O2+C=H2O+H2O2+CO+CO2 --- реакції утворення
CuSO4*5H2O=CuSO4+H2O+CuO+SO3+SO2+Cu2O --- реакції розкладу
CuSO4*5H2O+Fe(NO3)2+Fe(NO3)3+H2O=FeSO4*7H2O+Cu(NO3)2 --- реакції обміну
KMnO4+Na2SO3+H2SO4=MnSO4+Na2SO4+K2SO4+H2O --- ОВР
Na^+1+SO4^-2+SO3^-2=Na+Na2SO4+Na2SO3+NaSO4^-1 --- йонні реакції
CH3COOH+H2=CH3COH+H2+CH4+H2O+CH3CH2OH --- органічні реакції
C3H8O3=CH3+CH2+H+CO+OH+HCOH --- визначення функціональних груп
GliRaRbRc+PerH4=GliH3+GliH2Rc+GliRaRbH+GliRbH2+PerRaH3+PerRbRaH2+PerRbRaRcH --- використання псевдоелементів (груп) 
`;

sample_4=
`
A=B --------- чорний порох
KNO3+C+S=K2S+CO2+N2  ---- основні продукти
KNO3+C+S=K2S,CO2,N2+K2O, O2, K2SO4, K2CO3  ---- при відхиленні від оптимального складу
KNO3+C+S=K2S,CO2,N2+O2, K2SO4, K2CO3  ---- при відхиленні від оптимального складу
KNO3+C+S+CH2=K2S,CO2,N2+K2SO4, K2CO3+H2O  ---- при додаванні парафінів
KNO3+C+S+CH2O=K2S,CO2,N2+K2SO4, K2CO3+H2O  ---- при додаванні вуглеводів
KNO3+C+S+Al=K2S,CO2,N2+K2SO4, K2CO3+H2O+Al2O3  ---- при додаванні алюмінію
[(KNO3)2.1C2.8S0.9]=K2S,CO2,N2+K2SO4, K2CO3+H2O+KNO3+C+S ---- при фіксованому співвідношенні

A=B --------- бездимні вибухові речовини
C6H4(NO2)2+O2=O2+H2O+N2+CO2 --- [4.1.1]
C6H3(NO2)3+O2=O2+H2O+N2+CO2  --- [4.1.2] 
C6N6O12+O2=O2+H2O+N2+CO2  --- [4.1.3] TNT !!!!
C8H7N3O6+O2=O2+H2O+N2+CO2  --- [4.1.5]
H3COC6H2(NO2)3+O2=O2+H2O+N2+CO2  --- [4.1.6] 
C6H2(NO2)3OH+O2=O2+H2O+N2+CO2  --- [4.1.7] 
NH4C6H2N3O7+O2=O2+H2O+N2+CO2  --- [4.1.8] 
C6H5N5O6+O2=O2+H2O+N2+CO2  --- [4.1.9] 
C6H6N6O6+O2=O2+H2O+N2+CO2  --- [4.1.10]
C10H6N2O4+O2=O2+H2O+N2+CO2  --- [4.1.11] 
C12H6N8O12+O2=O2+H2O+N2+CO2  --- [4.1.12]  
C12H5N7O12+O2=O2+H2O+N2+CO2  --- [4.1.13]
C12H4N6O12S+O2=O2+H2O+N2+CO2+H2S  --- [4.1.14] 
C12H4N8O12+O2=O2+H2O+N2+CO2  --- [4.1.15]  
C14H6N6O12+O2=O2+H2O+N2+CO2  --- [4.1.16]  
C12H6N8O12+O2=O2+H2O+N2+CO2  --- [4.1.17]
C18H6N8O16+O2=O2+H2O+N2+CO2  --- [4.1.18]
(C6H2)3N(NO2)9+O2=O2+H2O+N2+CO2  --- [4.1.19] 
C17H7N11O16+O2=O2+H2O+N2+CO2  --- [4.1.20] 
(C6H2(NO2)3NH)3(C3N3),+O2=O2+H2O+N2+CO2  --- [4.1.21]
(C6H2(NO2)3)3(C3N3)+O2=O2+H2O+N2+CO2  --- [4.1.22] 
(C6H2(NO2)2)2(N4)+O2=O2+H2O+N2+CO2  --- [4.1.23]
(C6H2(NO2)3)3(C6(NO2)3) --- [4.1.24]
(C2N3H)NH(C6H2(NO2)3)+O2=O2+H2O+N2+CO2  --- [4.1.25]
C6N3(NO2)5+O2=O2+H2O+N2+CO2  --- [4.1.26]

O=O ----------4.2-----------------
C6H2(NO2)3N(NO2)(CH3)+O2=O2+H2O+N2+CO2  --- [4.2.1]
C3H6N3(NO2)3+O2=O2+H2O+N2+CO2  --- [4.2.2] 
C4H8N4(NO2)4+O2=O2+H2O+N2+CO2  --- [4.2.3]
(CH2)2(NH)2(NO2)2+O2=O2+H2O+N2+CO2  --- [4.2.4] 
(NH2)C(NH)NHNO2+O2=O2+H2O+N2+CO2  --- [4.2.5]  
(NH2)C(NNO2)NHNO2+O2=O2+H2O+N2+CO2  --- [4.2.6] DNG !!!!
NH2CONHNO2+O2=O2+H2O+N2+CO2  --- [4.2.7] 
(CH3)2(NNO2)2(CO)2+O2=O2+H2O+N2+CO2  --- [4.2.8] 
C2N4H2(NO2)2(CO)2+O2=O2+H2O+N2+CO2  --- [4.2.9]  
C2N4(NO2)4(CO)2+O2=O2+H2O+N2+CO2  --- [4.2.10]  TENGU !!!!
C2N4H(NO2)3(CO)(CH2)+O2=O2+H2O+N2+CO2  --- [4.2.11] 
C2H2N4(NO2)4(CO)(CH2)+O2=O2+H2O+N2+CO2  --- [4.2.12]  
C2H2N4(NO2)4(CH)2+O2=O2+H2O+N2+CO2  --- [4.2.13]  
C4N2H8(NO2)2+O2=O2+H2O+N2+CO2  --- [4.2.14]  
O2NN(CH2CH2ONO2)2+O2=O2+H2O+N2+CO2  --- [4.2.15]  
C6N4H10(NO2)4+O2=O2+H2O+N2+CO2  --- [4.2.16]
C3N3H4N(NO2)2+O2=O2+H2O+N2+CO2  --- [4.2.17] 
C3N3H4O(NO2)3+O2=O2+H2O+N2+CO2  --- [4.2.18]
C6H6N6(NO2)6+O2=O2+H2O+N2+CO2  --- [4.2.19]  
C6H6N2O4(NO2)2+O2=O2+H2O+N2+CO2  --- [4.2.20]  
C4N2O2HO(NO2)2+O2=O2+H2O+N2+CO2  --- [4.2.21]  
C4N4H6CO(NO2)4+O2=O2+H2O+N2+CO2  --- [4.2.22]
C4N2H6(NO2)4+O2=O2+H2O+N2+CO2  --- [4.2.23]
C3NH4(NO3)3+O2=O2+H2O+N2+CO2  --- [4.2.24] TNAZ !!!! 

O=O ----------4.3-----------------
C(CH2ONO2)4+O2=O2+H2O+N2+CO2  --- [4.3.1]  
CH2ONO2(CHONO2)4CH2ONO2+O2=O2+H2O+N2+CO2  --- [4.3.2]  нітроманіт !!!!
C2H3(ONO2)3+O2=O2+H2O+N2+CO2  --- [4.3.3] NG !!!!
(CH2ONO2)2+O2=O2+H2O+N2+CO2  --- [4.3.4]  
(CH2CH2ONO2)2O+O2=O2+H2O+N2+CO2  --- [4.3.5] 
(CH2)6O5(NO2)2+O2=O2+H2O+N2+CO2  --- [4.3.6]  
CH(CH2)3(ONO2)3+O2=O2+H2O+N2+CO2  --- [4.3.7]  
C6H7O2(OH)1(ONO2)2+O2=O2+H2O+N2+CO2  --- [4.3.8] 
CH3C(CH2ONO2)3+O2=O2+H2O+N2+CO2  --- [4.3.9]  
O2NC(CH2ONO2)3+O2=O2+H2O+N2+CO2  --- [4.3.10]  
(O2NOCH2)2C(NO2)C(NO2)(CH2ONO2)2 --- [4.3.11]

O=O ----------4.4-----------------
CH3NO2+O2=O2+H2O+N2+CO2  --- [4.4.1]  
C(NO2)3CH2OH+O2=O2+H2O+N2+CO2  ---- тринитроэтанол !!!!
HC(NO2)3+O2=O2+H2O+N2+CO2 --- Нітроформ !!!!
C(NO2)4+O2=O2+H2O+N2+CO2  --- [4.4.2] тетранітрометан !!!!
[C(NO2)3CH2NH]2CO+O2=O2+H2O+N2+CO2  --- [4.4.3]
[C(NO2)3CH2]2NNO2+O2=O2+H2O+N2+CO2  --- [4.4.4]  BTNEN !!!!
C(NO2)3CH2N(NO2)CH2CH2N(NO2)CH2C(NO2)3+O2=O2+H2O+N2+CO2  --- [4.4.5] 
CH3N(NO2)CH2C(NO2)3+O2=O2+H2O+N2+CO2  --- [4.4.6]  
C2H5N(NO2)CH2C(NO2)3+O2=O2+H2O+N2+CO2  --- [4.4.7]
C(NO2)3CH2CH2(CO)OCH2C(NO2)3+O2=O2+H2O+N2+CO2  --- [4.4.8] 
(C(NO2)3CH2O)2CH2+O2=O2+H2O+N2+CO2  --- [4.4.9]  TEFO !!!!
C2(NH2)2(NO2)2+O2=O2+H2O+N2+CO2  --- [4.4.10] 
C8(NO2)8+O2=O2+H2O+N2+CO2  --- [4.4.11]  
[N2FC(NO2)2CH2]2NNO2+O2=O2+H2O+N2+CO2+HF  --- [4.4.12]  речовина АБ !!!!

O=O ----------4.5-----------------
C6(N2O2)3+O2=O2+H2O+N2+CO2  --- [4.5.1]
C6H(NO2)2(NH2)(N2O2)+O2=O2+H2O+N2+CO2  --- [4.5.2]
C6(NO2)2(NH2)2(N2O2)+O2=O2+H2O+N2+CO2  --- [4.5.3]
C6(NO2)(NH2)(N2O2)2+O2=O2+H2O+N2+CO2  --- [4.5.4] CL-18 !!!!
C6(NO2)3(NH2)(N2O2)+O2=O2+H2O+N2+CO2  --- [4.5.5] CL-17 !!!!

O=O ----------4.6-----------------
(C2N2O)NH(NO2)2+O2=O2+H2O+N2+CO2  --- [4.6.1] нитраминонитрофуразан !!!!
(C2N2ON)2O(NH2)2+O2=O2+H2O+N2+CO2  --- [4.6.2]  
H2N(C2N2O)NN(C2N2O)NH2+O2=O2+H2O+N2+CO2  --- [4.6.3]  
(C2N2O)2O(NO2)2+O2=O2+H2O+N2+CO2  --- [4.6.4]
(C2N2O)2N2O(NO2)2+O2=O2+H2O+N2+CO2  --- [4.6.5]
(C2N2O)2(NO2)2+O2=O2+H2O+N2+CO2  --- [4.6.6]
(C2N2O)(C2N2H4)(NO2)2+O2=O2+H2O+N2+CO2  --- [4.6.7]
(C2N2O)3O(NO2)2+O2=O2+H2O+N2+CO2  --- [4.6.8] 
(C2N2O)2N2(ONO2)2+O2=O2+H2O+N2+CO2  --- [4.6.9]

O=O ----------4.7-----------------
(C3N2H2)(NO2)2+O2=O2+H2O+N2+CO2  --- [4.7.1]
(C3N2)(NO2)3(NH4)+O2=O2+H2O+N2+CO2  --- [4.7.2] 
(C3N2H)(NO2)3+O2=O2+H2O+N2+CO2  --- [4.7.3]
(C4N2)(NH2)2(NO2)2+O2=O2+H2O+N2+CO2  --- [4.7.4]
(C4N2)(NH2)2(NO2)2+O2=O2+H2O+N2+CO2  --- [4.7.5]
(C4N2)(NH2)2(NO2)2O+O2=O2+H2O+N2+CO2  --- [4.7.6]
(C5NH2)(NO2)3+O2=O2+H2O+N2+CO2  --- [4.7.7] 

O=O ----------4.8-----------------
C2N3H2(NO2)O+O2=O2+H2O+N2+CO2 --- [4.8.1]
C2N3(NO2)2(NH4)+O2=O2+H2O+N2+CO2  --- [4.8.3]
C2N3H(NO2)(NH2)+O2=O2+H2O+N2+CO2  --- [4.8.4]
C2N3(CH3)(NO2)2+O2=O2+H2O+N2+CO2  --- [4.8.5]
(C2N4)2N2(NH2)2+O2=O2+H2O+N2+CO2  --- [4.8.6]

O=O ----------4.9-----------------
C2N4(N3)2O2+O2=O2+H2O+N2+CO2  --- [4.9.2]

O=O ----------4.10-----------------
C3N3H6(NO)3+O2=O2+H2O+N2+CO2  --- [4.10.1]

O=O ----------4.11----------------- 
NH4NO3+O2=O2+H2O+N2+CO2  --- [4.11.1] амонію нітрат AN !!!!
(NH2)2CNH*HNO3+O2=O2+H2O+N2+CO2  --- [4.11.2]
CO(NH2)2*HNO3+O2=O2+H2O+N2+CO2  --- [4.11.3] 
(CH2NH2)2*2HNO3+O2=O2+H2O+N2+CO2  --- [4.11.4] 
CH3NH2*HNO3+O2=O2+H2O+N2+CO2  --- [4.11.5] 
H2NNC(NHNH2)2*HNO3+O2=O2+H2O+N2+CO2  --- [4.11.6] 
N2H4*HNO3+O2=O2+H2O+N2+CO2  --- [4.11.7] нітрат гідразіну !!!!

O=O ----------4.12----------------- 
NH4ClO4+O2=O2+H2O+N2+CO2+HCl  --- [4.12.1] амонію перхлорат !!!!
HClO4*(NH2)2CNH+O2=O2+H2O+N2+CO2+HCl  --- [4.12.2] 
HClO4*CH3NH2+O2=O2+H2O+N2+CO2+HCl  --- [4.12.3]	
N2H4*HClO4+O2=O2+H2O+N2+CO2+HCl  --- [4.12.4] перхлорат гідразіну !!!!

O=O ----------4.13----------------- 
NH4N(NO2)2+O2=O2+H2O+N2+CO2  --- [4.13.1] 
C2NH(NH2)2(NH)O*(NH)(NO2)2+O2=O2+H2O+N2+CO2  --- [4.13.2] 
N2H4*HC(NO2)+O2=O2+H2O+N2+CO2  --- [4.13.3]`;

sample_5=
`CH2+CH4
`;

//попереднє перекодування
const replacements = [
  ["Чорний", "R-255G-255B-255"],
  ["Білий", "R255G255B255"],
  ["Сірий", "R128G128B128"],
  ["Світло-сірий", "R211G211B211"],
  ["Темно-сірий", "R169G169B169"],
  ["Червоний", "R255G0B0"],
  ["Темно-червоний", "R139G0B0"],
  ["Рожевий", "R255G192B203"],
  ["Магента", "R255G0B255"],
  ["Пурпуровий", "R128G0B128"],
  ["Фіолетовий", "R238G130B238"],
  ["Індіго", "R75G0B130"],
  ["Жовтий", "R255G255B0"],
  ["Золотий", "R255G215B0"],
  ["Помаранчевий", "R255G165B0"],
  ["Персиковий", "R255G218B185"],
  ["Коричневий", "R165G42B42"],
  ["Шоколадний", "R210G105B30"],
  ["Оливковий", "R128G128B0"],
  ["Зелений", "R0G128B0"],
  ["Лаймовий", "R0G255B0"],
  ["Темно-зелений", "R0G100B0"],
  ["Бірюзово-зелений (Teal)", "R0G128B128"],
  ["Бірюзовий", "R64G224B208"],
  ["Ціан", "R0G255B255"],
  ["М’ятний", "R152G255B152"],
  ["Синій", "R0G0B255"],
  ["Темно-синій (Navy)", "R0G0B128"],
  ["Блакитний", "R0G191B255"],
  ["Небесно-блакитний", "R135G206B235"],
  ["Лавандовий", "R230G230B250"],
  ["Сріблястий", "R192G192B192"]
];


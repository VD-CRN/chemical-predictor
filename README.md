# 🧪 Chemical Predictor (VA-CRN Project)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17400683.svg)](https://doi.org/10.5281/zenodo.17400683)

**Open-source platform for vector-based stoichiometry and chemical reaction network generation**  
Developed as part of the *Vector-Based Chemical Reaction Network (VD-CRN)* initiative  
at the **École Polytechnique Fédérale de Lausanne (EPFL)** and  
the **Kharkiv National University of Radio Electronics (NURE)**.

---

## 🌍 Overview
The **Chemical Predictor** is a scientific software framework that provides:
- automated balancing of chemical reactions using a **vector algebraic approach**;
- generation of **complete and non-redundant** reaction networks for multicomponent systems;
- compatibility with modern CRN tools such as **Cantera**, **CHEMKIN**, and **RMG**;
- fully reproducible computational experiments for research and education.

This project unifies algorithmic chemistry, mathematics, and informatics  
to make reaction network exploration **transparent, verifiable, and open-source**.

---

## ⚙️ Repository structure
```
chemical-predictor/
│
├── packages/
│   ├── core/          # Core mathematical engine (Python)
│   ├── web/           # Web interface (JavaScript / HTML)
│   └── py-backend/    # Python backend (FastAPI / Flask)
│
├── docs/              # Scientific documentation & API guide
├── tests/             # Unit tests for reproducibility
├── CITATION.cff       # Citation metadata
└── LICENSE            # Apache 2.0 license
```

---

## 🚀 Installation (preview)
```bash
git clone https://github.com/VD-CRN/chemical-predictor.git
cd chemical-predictor
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

> Web interface and Python API will be included in upcoming releases.

---

## 🧬 Scientific background
The algorithm is based on the **Vector-Based Stoichiometry Method (VA-CRN)**  
developed by *Nataliia Yilmaz* (EPFL) and *Pavlo Kozub* (NURE).  
It reconstructs chemical reaction systems through linear-algebraic transformations  
of element composition vectors — a mathematically rigorous approach to reaction analysis  
that can generate **all possible valid reaction sets** for given components.

---

## 👩‍🔬 Authors and contributors
| Name | Affiliation | Role |
|------|--------------|------|
| **Nataliia Yilmaz** | EPFL | Principal Investigator |
| **Pavlo Kozub** | NURE | Algorithm design, core development |

---

## 📖 Citation
If you use this software, please cite it as:

> Kozub P., Yilmaz N. *Chemical Predictor (VA-CRN Project):  
> Vector-Based Chemical Reaction Network Generator*,  
> GitHub: [https://github.com/VD-CRN/chemical-predictor](https://github.com/VD-CRN/chemical-predictor), 2025.  
> DOI (via Zenodo): *to be assigned.*

---

## 📘 CITATION.cff
```
cff-version: 1.2.0
message: "If you use this software, please cite it as below."
title: "Chemical Predictor (VA-CRN): Vector-Based Chemical Reaction Network Generator"
version: 1.0.0
date-released: 2025-10-20
doi: 10.5281/zenodo.pending
authors:
  - family-names: Kozub
    given-names: Pavlo
    affiliation: "Kharkiv National University of Radio Electronics (NURE)"
    orcid: "https://orcid.org/0000-0002-7162-027X"
  - family-names: Yilmaz
    given-names: Nataliia
    affiliation: "École Polytechnique Fédérale de Lausanne (EPFL)"
repository-code: "https://github.com/VD-CRN/chemical-predictor"
license: Apache-2.0
keywords:
  - vector-based stoichiometry
  - chemical reaction networks
  - VA-CRN
  - computational chemistry
  - EPFL
```

---

## ⚖️ License
This project is distributed under the **Apache License 2.0**.  
© 2025 École Polytechnique Fédérale de Lausanne (EPFL) and contributors.

---

## 🧩 Maintainers
- **Pavlo Kozub** — `@pkozub-git`  
- **Nataliia Yilmaz** — `@nataliyilmaz` (EPFL)  

For collaboration or contribution requests, please open an **Issue** or contact the maintainers directly.

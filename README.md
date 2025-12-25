# React + Vite
-
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
-
Account Code	Account Name	Type
1000	Cash	Asset
1010	Bank	Asset
1200	Accounts Receivable	Asset
2000	Accounts Payable	Liability
3000	Capital / Owner’s Equity	Equity
4000	Sales Revenue	Revenue
5000	Cost of Goods Sold	Expense
5100	Rent Expense	Expense
5200	Utilities Expense	Expense
5300	Salaries Expense	Expense
Notes:

Code Structure: Often, codes are structured so the first digit indicates the type:

1xxx → Assets

2xxx → Liabilities

3xxx → Equity

4xxx → Revenue

5xxx → Expenses
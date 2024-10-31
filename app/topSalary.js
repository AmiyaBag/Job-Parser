const Vacancy = require('./db-connection');

function extractSalary(salaryStr) {
    const salaryMatch = salaryStr.match(/(\d+[\d,]*(?:[\.]\d+)?)/);
    return salaryMatch ? parseFloat(salaryMatch[0].replace(',', '.')) : null;
}

async function getSalaryRanges() {
    try {
        // Загружаем данные из базы данных
        const vacancies = await Vacancy.find();
        const salaries = vacancies.map(vacancy => extractSalary(vacancy.salary));

        // Определяем диапазоны зарплат
        const salaryRanges = [
            { name: "800-10000", count: 0 },
            { name: "10000-25000", count: 0 },
            { name: "25000-30000", count: 0 },
            { name: "30000-45000", count: 0 },
            { name: "45000-60000", count: 0 },
            { name: "60000-75000", count: 0 },
            { name: "75000-90000", count: 0 },
            { name: "90000-105000", count: 0 },
            { name: "105000-120000", count: 0 },
            { name: "120000-135000", count: 0 },
            { name: "135000-200000", count: 0 }
        ];

        // Подсчитываем количество зарплат в каждом диапазоне
        salaries.forEach(salary => {
            if (salary !== null) {
                const rangeIndex = salaryRanges.findIndex(range => salary >= parseFloat(range.name.split('-')[0]) && salary < parseFloat(range.name.split('-')[1]));
                if (rangeIndex !== -1) {
                    salaryRanges[rangeIndex].count++;
                }
            }
        });

        return salaryRanges;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return [];
    }
}

/*
getSalaryRanges().then(salaryRanges => {
    console.log(salaryRanges);
});
*/

module.exports = getSalaryRanges();
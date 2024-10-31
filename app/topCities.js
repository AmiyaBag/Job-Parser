const Vacancy = require('./db-connection');
async function findMostCommonCities() {
    try {
        // Запрос на выборку 6 самых распространенных городов
        const result = await Vacancy.aggregate([
            {
                $group: {
                    _id: '$city', // Группировка по полю 'city'
                    count: { $sum: 1 } // Подсчет количества записей для каждого города
                }
            },
            {
                $sort: { count: -1 } // Сортировка по убыванию количества
            },
            {
                $limit: 5 // Ограничение на 6 записей
            }
        ]);
  
        // Преобразование результатов в более читаемый формат
  
        const cities = result.map(item => ({
            name: item._id.toString(),
            count: item.count.toString()
        }));
  
        // console.log(cities[1].city);
        return cities;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
  }

const topCities = findMostCommonCities();
module.exports = findMostCommonCities();
class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;                   //Код товара
        this.name = name;               //Наименование
        this.description = description; //Описание
        this.sizes = sizes;             //Массив возможных размеров
        this.price = price;             //Цена товара
        this.available = available;     //Признак доступности для продажи
    }

    setAvailable(available) {
        this.available = available
    }
}

class GoodsList {
    #goods;
    constructor(filter, sortPrice, sortDir) {
        this.#goods = [];           //массив экземпляров объектов класса Good (приватное поле)
        this.filter = filter;       //регулярное выражение используемое для фильтрации товаров по полю name
        this.sortPrice = sortPrice; //булево значение, признак включения сортировки по полю Price
        this.sortDir = sortDir;     //булево значение, признак направления сортировки по полю Price (true - по возрастанию, false - по убыванию)
    }

    get list() {    //возвращает массив доступных для продажи товаров в соответствии с установленным фильтром и сортировкой по полю Price
        let goods = this.#goods.slice(0);
        let regexp = new RegExp(`${this.filter}`, 'i');
        for (let i=goods.length - 1; i>=0; i--) {
            if (goods[i].available === false || regexp.exec(goods[i].name) === null) {
                goods.splice(i, 1);
            }
        }
        if (this.sortPrice === true) {
            if (this.sortDir === true) {
                goods.sort((a, b) => a.price > b.price ? 1 : -1);
            }
            else {
                goods.sort((a, b) => a.price > b.price ? -1 : 1);
            }
        }
        return goods;
    }

    add(good) {     //добавление товара в каталог
        this.#goods.push(good);
    }
    
    remove(id) {    //удаление товара из каталога по его id
        for (let i=0; i<this.#goods.length; i++) {
            if (this.#goods[i].id === id) {
                this.#goods.splice(i, 1);
            }
        }
    }
}

class BasketGood extends Good {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    }
}

class Basket {
    constructor() {
        this.goods = []
    }
    
    get totalAmount() {         //возвращает общую стоимость товаров в корзине
        let priceList = this.goods.map(function(item) {
            return item.price * item.amount;
        });
        
        let allPrice = 0;
        priceList.forEach(function(item) {
            allAmount += item;
        });
        return allPrice
    }

    get totalSum() {            //возвращает общее количество товаров в корзине
        let amountList = this.goods.map(function(item) {
            return item.amount;
        });

        let allAmount = 0;
        amountList.forEach(function(item) {
            allAmount += item;
        });
        return allAmount
    }

    add(good, amount) {         //Добавляет товар в корзину, если товар уже есть увеличивает количество
        let id = good.id;
        let name = good.name;
        let description = good.description;
        let sizes = good.sizes;
        let price = good.price;
        let available = good.available;

        let idList = this.goods.map(function(item) {
            return item.id;
        });

        if (idList.includes(id)) {
            this.goods.forEach(function(item) {
                if (id === item.id) {
                    item.amount += amount;
                }
            });
        }
        else {
            this.goods.push(new BasketGood(id, name, description, sizes, price, available, amount));
        }
    }

    remove(good, amount) {      //Уменьшает количество товара в корзине, если количество становится равным нулю, товар удаляется
        let id = good.id;
    
        let idList = this.goods.map(function(item) {
            return item.id;
        });

        if (idList.includes(id)) {
            this.goods.forEach(function(item, position, goodsList) {
                if (id === item.id) {
                    item.amount -= amount;
                }
                if (item.amount <= 0) {
                    goodsList.splice(position, 1);
                }
            });
        }
    }

    clear() {                   //Очищает содержимое корзины
        this.goods.length = 0;
    }

    removeUnavailable() {       //Удаляет из корзины товары, имеющие признак available === false (использовать filter())
        this.goods.forEach(function(item, position, goodsList) {
            if (item.available === false) {
                goodsList.splice(position, 1);
            }
        });
    }
}


const goodsList = new GoodsList('ябло', true, true);
const good1 = new Good(1, 'Яблоки красные', 'Cладкие как поцелуй прекрасной девы.', ['Extra', 'XL', 'L', 'M', 'S'], 89, true);
const good2 = new Good(2, 'Сыр', 'Просто сыр из молочка коровки', ['Extra', 'XL', 'L', 'M', 'S'], 199, true);
const good3 = new Good(3, 'Яблоки зеленые', 'Яблоки зеленого цвета', ['Extra', 'XL', 'L', 'M', 'S'], 87, true);
const good4 = new Good(4, 'Яблоки голден', 'Удивительно вкусные яблоки светло-зеленого цвета', ['Extra', 'XL', 'L', 'M', 'S'], 119, true);
const good5 = new Good(5, 'Сырок творожный', 'Никакого сыра, только творог и глазурь', ['Extra', 'XL', 'L', 'M', 'S'], 29, true);
const good6 = new Good(6, 'Штрудель яблочный', 'Выпечка с яблочной начинкой', ['Extra', 'XL', 'L', 'M', 'S'], 99, true);
goodsList.add(good1);
goodsList.add(good2);
goodsList.add(good3);
goodsList.add(good4);
goodsList.add(good5);
goodsList.add(good6);

good3.setAvailable(false);
goodsList.remove(2);

const basket = new Basket();
// console.log(basket); //проверяем что корзина создана и пуста

basket.add(good1, 5);
basket.add(good2, 6);
basket.add(good3, 34);
basket.add(good4, 11);
basket.add(good5, 7);
basket.add(good6, 1);
// console.log(basket); //проверяем что корзина не пуста

basket.add(good6, 9);
// console.log(basket); //проверяем что количество товара 6 увеличилось на 9 единиц

basket.remove(good6, 7);
// console.log(basket); //проверяем что количество товара 6 уменьшилось на 7 единиц
basket.remove(good6, 3);
// console.log(basket); //проверяем что количество товара 6 уменьшилось на 3 единицы, стало равным нулю и товар удалился из корзины
basket.remove(good5, 8);
// console.log(basket); //проверяем что количество товара 5 уменьшилось на 8 единиц, стало равным -1 и товар удалился из корзины

basket.removeUnavailable();
// console.log(basket); //должен удалиться продукт с id3

basket.clear();
// console.log(basket); //проверяем что корзина пуста
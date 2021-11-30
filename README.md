# Shopping App

## Genel

* Uygulamayı çalıştırmadan .env dosyasını içine yerleştirmek gerekiyor. Database, jwt secret ve ilk admin şifresi gibi bilgiler oradan okunuyor.
* Dökümantasyon docs dosyasının içinde, postman'e import etmek gerekiyor.
* Database heroku free'de olduğu için istekler biraz yavaş çalışıyor. Lokalde çok çok daha hızlı.

## Test
* Testlerin hepsinin düzgün olarak çalışabilmesi için başlarında bulunan alanların güncel olarak doldurulması gerekiyor. (token, id v.b). Daha otomatize yazılabilinirdi aslında ama ilk kez test yazdım açıkçası.

## Login
* Kullanıcı oluşturmak için /signup endpointi, kullanıcı girişi yapmak için /login endpointine istek atmak gerekiyor. Buradan JWT gelecektir. Diğer endpointlerde çalışabilmek için Bearer token olarak göndermek gerekiyor.

## Customer Endpointleri
* Customer girişinden kullanıcının orderlarını görmek için /customer/order'a GET, yeni order eklemek için POST göndermek gerekiyor. Order detail'i görmek için ise /customer/order/:orderId ' e get göndermek gerekiyor.
* Tüm productları görmek için /product'a GET isteği, tek product detaylarını görüntülemek için /product/:id olarak GET göndermek gerekiyor.

## Admin Endpointleri
* Başlangıçta otomatik olarak admin kullanıcısı .env dosyasından okunan şifreyle admin kullanıcısı oluşuyor.
product ekleme, product değiştirme, tüm kullanıcıları listeleme ve yeni admin kullanıcısı yaratma sadece admin kullanıcısıyla yapılabiliniyor.
* Admin girişinden product oluşturmak için /product-admin'e POST, değiştirmek için ise /product-admin/:productId 'e POST göndermek gerekiyor.
* Admin girişinden tüm kullanıcıları listelemek için /user-admin'e GET isteği, eklemek için POST göndermek gerekiyor.

## .env İçeriği
ADMIN_PASSWORD=<br>
JWT_SECRET=<br>
JWT_EXPIRES=<br>
DB_URL=

### Install Dependencies
```
$ npm install
```
### Development Start
```
$ npm run devstart
```
### Build
```
$ npm run build
```
### Test
```
npm run test
```




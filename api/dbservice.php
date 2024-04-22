<?php
function dbconnect()
{
    static $database;
    if (!isset($database)) {
        $database = mysqli_connect('localhost', 'root', '', 'travelis');
    }
    return $database;
}

function clearSQL($value) {
    return mysqli_real_escape_string(dbconnect(), $value);
}

function signIn($data)
{
    $email = clearSQL($data['email']);
    $password = clearSQL($data['password']);
    $noHash = isset($data['noHash']) ? $data['noHash'] : false;
    $query = "SELECT * FROM `users` WHERE `email`='$email' LIMIT 1";
    $check = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
    if (isset($check[0])) {
        if ($noHash ? $password === $check[0][6] : password_verify($password, $check[0][6])) {
            $idUser = $check[0][0];
            $query = "SELECT `tour_user`.`id_tour` FROM `tour_user` WHERE `tour_user`.`id_user`='$idUser';";
            $check[0][] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
            return ['result' => $check[0], 'message' => 'Вы успешно авторизованы!', 'status' => true];
        }
    }
    return ['result' => '', 'message' => 'Почта или пароль неверные! Попробуйте ещё раз!', 'status' => false];
}

function signUp($data)
{
    $email = clearSQL($data['email']);
    $lastName = clearSQL($data['lastName']);
    $firstName = clearSQL($data['firstName']);
    $patronymic = clearSQL($data['patronymic']);
    $password = password_hash(clearSQL($data['password']), PASSWORD_DEFAULT);
    $query = "SELECT * FROM `users` WHERE `email`='$email' LIMIT 1";
    $check = !count(mysqli_fetch_all(mysqli_query(dbconnect(), $query)));
    if ($check) {
        $query = "INSERT INTO `users` (`last_name`, `first_name`, `patronymic`, `email`, `password`) 
        SELECT '$lastName', '$firstName', '$patronymic', '$email', '$password' FROM DUAL 
        WHERE NOT EXISTS (SELECT * FROM `users` WHERE `email`='$email' LIMIT 1);";
        mysqli_query(dbconnect(), $query);
        return ['result' => '', 'message' => 'Вы успешно зарегистрированы!', 'status' => true];
    } else {
        return ['result' => '', 'message' => 'Клиент с такой почтой уже существует! Попробуйте другую!', 'status' => false];
    }
}

function addImage($image) {
    $file_chunks = explode(";base64,", $image);
    $fileType = explode("image/", $file_chunks[0]);
    $image_type = $fileType[1];
    $base64Img = base64_decode($file_chunks[1]);
    $path = "/upload/" . uniqid() . '.' . $image_type;
    $file = dirname(__FILE__) . $path;
    file_put_contents($file, $base64Img);
    return [
        'path' => $path,
        'type' => $image_type,
        'size' => filesize($file) / 1000000
    ];
}

function createArticle($data)
{
    $nameArticle = clearSQL($data['nameArticle']);
    $arrayContent = json_decode($data['arrayContent']);
    $arrayImage = json_decode($data['arrayImage']);
    $subject = clearSQL($data['subject']);
    $idUser = clearSQL($data['idUser']);

    $files = [];
    $iterator = 0;

    foreach ($arrayImage as $image) {
        $file = addImage($image);
        $path = clearSQL($file['path']);
        $type = clearSQL($file['type']);
        $size = clearSQL($file['size']);
        if (isset($path) && isset($type) && isset($size)) {
            $query = "INSERT INTO `images` (`path`, `type`, `size`) VALUES ('$path', '$type', '$size');";
            mysqli_query(dbconnect(), $query);
            $query = "SELECT * FROM `images` WHERE `path`='$path';";
            $scope = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
            $files[] = isset($scope[0]) ? isset($scope[0][0]) ? $scope[0][0] : [] : [];
        }
    }

    foreach ($arrayContent as $key => $content) {
        if ($content->type === 'IMAGE') {
            $arrayContent[$key] = [
                'type' => 'IMAGE',
                'id' => $files[$iterator++],
            ];
        }
    }

    $content = json_encode($arrayContent, JSON_UNESCAPED_UNICODE);
    $query = "INSERT INTO `articles` (`name`, `content`, `subject`, `likes`, `enable`, `report`) VALUES ('$nameArticle', '$content', '$subject', '0', '0', '0');";
    $check = mysqli_query(dbconnect(), $query);
    if ($check) {
        $query = "SELECT * FROM `articles` WHERE `name`='$nameArticle' AND `content`='$content'";
        $scope = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
        $idArticle = isset($scope[0]) && isset($scope[0][0]) ? $scope[0][0] : 0;
        if ($idArticle) {
            $query = "INSERT INTO `article_user` (`id_article`, `id_user`) VALUES ('$idArticle', '$idUser');";
            $check = mysqli_query(dbconnect(), $query);
            if ($check) {
                return ['result' => [], 'message' => 'Статья успешно создана!', 'status' => true];
            }
        }
    }

    return ['result' => [], 'message' => 'Ошибка создания статьи! Попробуйте ещё раз!', 'status' => false];
}

function getSubjects() {
    $query = "SELECT * FROM `subjects`";
    return ['result' => mysqli_fetch_all(mysqli_query(dbconnect(), $query)), 'message' => 'Тематики успешно получены!', 'status' => true];
}

function getArticles() {
    $query = "SELECT `articles`.`id`, `articles`.`name`, `articles`.`content`, `articles`.`subject`, `articles`.`likes`, `articles`.`enable`, `articles`.`report`, `articles`.`reason`, `users`.`last_name`, `users`.`first_name`, `users`.`patronymic`, `users`.`email`
FROM `articles`
INNER JOIN `article_user` ON `articles`.`id` = `article_user`.`id_article`
INNER JOIN `users` ON `users`.`id` = `article_user`.`id_user` WHERE `articles`.`enable`='1' AND `articles`.`report`='0' ORDER BY `articles`.`likes` DESC";
    $array = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

    if (count($array)) {
        foreach ($array as $key => $article) {
            $newArrayContent = [];
            $contents = json_decode($article[2]);

            foreach ($contents as $content) {
                if ($content->type === 'IMAGE') {
                    $id = $content->id;
                    $query = "SELECT * FROM `images` WHERE `id`='$id'";
                    $newArrayContent[] = [
                        'type' => 'IMAGE',
                        'content' => substr(mysqli_fetch_all(mysqli_query(dbconnect(), $query))[0][1], 1),
                    ];
                } else {
                    $newArrayContent[] = [
                        'type' => $content->type,
                        'content' => $content->content,
                    ];
                }
            }
            unset($article[2]);
            $article[2] = $newArrayContent;

            $query = "SELECT `subjects`.`name` FROM `subjects` WHERE `id`='$article[3]'";
            unset($article[3]);
            $article[3] = mysqli_fetch_all(mysqli_query(dbconnect(), $query))[0][0];

            $idArticle = $article[0];
            $query = "SELECT `comments`.`id`, `comments`.`text`, `comments`.`time`, `comments`.`likes`, `users`.`last_name`, `users`.`first_name`, `users`.`patronymic`, `users`.`email` FROM `article_comment`
INNER JOIN `comments` ON `article_comment`.`comment_id` = `comments`.`id`
INNER JOIN `users` ON `users`.`id` = `comments`.`author` WHERE `article_comment`.`article_id`='$idArticle' AND `comments`.`hide`='0';";
            $comments = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

            foreach ($comments as $k => $comment) {
                $commentId = $comment[0];
                $query = "SELECT `comment_like`.`user_id` FROM `comment_like` WHERE `comment_like`.`comment_id`='$commentId';";
                $comments[$k][] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
            }

            $article[] = $comments;

            $query = "SELECT `article_like`.`user_id` FROM `article_like` WHERE `article_like`.`article_id`='$idArticle';";
            $article[] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

            $array[$key] = $article;
        }

        return ['result' => $array, 'message' => 'Статьи успешно получены!', 'status' => true];
    }
    return ['result' => [], 'message' => 'Статьи успешно получены!', 'status' => true];
}

function reportArticle($data) {
    $idArticle = clearSQL($data['idArticle']);
    $idUser = clearSQL($data['idUser']);
    $query = "UPDATE `articles` SET `report` = '1' WHERE `articles`.`id` = '$idArticle';";
    $check = mysqli_query(dbconnect(), $query);

    if ($check) {
        $query = "SELECT * FROM `article_user_report` WHERE `id_article`='$idArticle' AND `id_user`='$idUser';";
        $check = !count(mysqli_fetch_all(mysqli_query(dbconnect(), $query)));
        if ($check) {
            $query = "INSERT INTO `article_user_report` (`id_article`, `id_user`) VALUES ('$idArticle', '$idUser');";
            $check = mysqli_query(dbconnect(), $query);
            return ['result' => [], 'message' => 'Жалоба успешно отправлена!', 'status' => $check];
        }
    }
    return ['result' => [], 'message' => 'Ошибка жалобы на статью! Попробуйте ещё раз!', 'status' => false];
}

function createCommentArticle($data) {
    $idArticle = clearSQL($data['idArticle']);
    $text = clearSQL($data['text']);
    $author = clearSQL($data['author']);
    $query = "INSERT INTO `comments` (`text`, `author`) VALUES ('$text', '$author');";
    $check = mysqli_query(dbconnect(), $query);

    if ($check) {
        $query = "SELECT * FROM `comments` WHERE `text`='$text' AND `author`='$author';";
        $fetch = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
        if (isset($fetch) && isset($fetch[0]) && isset($fetch[0][0])) {
            $id = $fetch[0][0];
            $query = "INSERT INTO `article_comment` (`article_id`, `comment_id`) VALUES ('$idArticle', '$id');";
            $check = mysqli_query(dbconnect(), $query);
            return ['result' => [], 'message' => 'Комментарий успешно добавлен!', 'status' => $check];
        }
    }
    return ['result' => [], 'message' => 'Ошибка добавления комментария! Попробуйте ещё раз!', 'status' => false];
}

function createCommentTour($data) {
    $idTour = clearSQL($data['idTour']);
    $text = clearSQL($data['text']);
    $author = clearSQL($data['author']);
    $query = "INSERT INTO `comments` (`text`, `author`) VALUES ('$text', '$author');";
    $check = mysqli_query(dbconnect(), $query);

    if ($check) {
        $query = "SELECT * FROM `comments` WHERE `text`='$text' AND `author`='$author';";
        $fetch = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
        if (isset($fetch) && isset($fetch[0]) && isset($fetch[0][0])) {
            $id = $fetch[0][0];
            $query = "INSERT INTO `tour_comment` (`tour_id`, `comment_id`) VALUES ('$idTour', '$id');";
            $check = mysqli_query(dbconnect(), $query);
            return ['result' => [], 'message' => 'Комментарий успешно добавлен!', 'status' => $check];
        }
    }
    return ['result' => [], 'message' => 'Ошибка добавления комментария! Попробуйте ещё раз!', 'status' => false];
}

function likeArticle($data) {
    $idArticle = clearSQL($data['idArticle']);
    $idUser = clearSQL($data['idUser']);
    $like = clearSQL($data['like']);
    $increment = $data['increment'];

    if ($increment === 'true') {
        $query = "INSERT INTO `article_like` (`article_id`, `user_id`) VALUES ('$idArticle', '$idUser');";
        $check = mysqli_query(dbconnect(), $query);
    } else {
        $query = "DELETE FROM `article_like` WHERE `article_like`.`article_id` = '$idArticle' AND `article_like`.`user_id` = '$idUser'";
        $check = mysqli_query(dbconnect(), $query);
    }
    $query = "UPDATE `articles` SET `likes` = '$like' WHERE `articles`.`id`='$idArticle';";
    $likeCheck = mysqli_query(dbconnect(), $query);

    return ['result' => [], 'message' => '', 'status' => $check && $likeCheck];
}

function likeTour($data) {
    $idTour = clearSQL($data['idTour']);
    $idUser = clearSQL($data['idUser']);
    $like = clearSQL($data['like']);
    $increment = $data['increment'];

    if ($increment === 'true') {
        $query = "INSERT INTO `tour_like` (`tour_id`, `user_id`) VALUES ('$idTour', '$idUser');";
        $check = mysqli_query(dbconnect(), $query);
    } else {
        $query = "DELETE FROM `tour_like` WHERE `tour_like`.`tour_id` = '$idTour' AND `tour_like`.`user_id` = '$idUser'";
        $check = mysqli_query(dbconnect(), $query);
    }
    $query = "UPDATE `tours` SET `likes` = '$like' WHERE `tours`.`id`='$idTour';";
    $likeCheck = mysqli_query(dbconnect(), $query);

    return ['result' => [], 'message' => '', 'status' => $check && $likeCheck];
}

function likeComment($data) {
    $idComment = clearSQL($data['idComment']);
    $idUser = clearSQL($data['idUser']);
    $like = clearSQL($data['like']);
    $increment = $data['increment'];

    if ($increment === 'true') {
        $query = "INSERT INTO `comment_like` (`comment_id`, `user_id`) VALUES ('$idComment', '$idUser');";
        $check = mysqli_query(dbconnect(), $query);
    } else {
        $query = "DELETE FROM `comment_like` WHERE `comment_like`.`comment_id` = '$idComment' AND `comment_like`.`user_id` = '$idUser'";
        $check = mysqli_query(dbconnect(), $query);
    }
    $query = "UPDATE `comments` SET `likes` = '$like' WHERE `comments`.`id`='$idComment';";
    $likeCheck = mysqli_query(dbconnect(), $query);

    return ['result' => [], 'message' => '', 'status' => $check && $likeCheck];
}

function getAllUser() {
    $query = "SELECT * FROM `users`;";
    $check = mysqli_query(dbconnect(), $query);
    $newArray = [];

    foreach (mysqli_fetch_all($check) as $key => $user) {
        $newArray[$key] = $user;
        $idUser = $user[0];
        $query = "SELECT `tour_user`.`id_tour` FROM `tour_user` WHERE `tour_user`.`id_user`='$idUser';";
        $newArray[$key][] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
    }


    return ['result' => $newArray, 'message' => 'Пользователи успешно получены!', 'status' => $check];
}

function updateUser($data) {
    $id = clearSQL($data['id']);
    $block = clearSQL($data['block']);
    $role = clearSQL($data['role']);

    $query = "UPDATE `users` SET `block` = '$block', `role` = '$role' WHERE `users`.`id`='$id';";
    $check = mysqli_query(dbconnect(), $query);
    return ['result' => [], 'message' => $check ? 'Пользователь успешно обновлен!' : 'Ошибка обновления пользователя!', 'status' => $check];
}

function getReviewArticles() {
    $query = "SELECT `articles`.`id`, `articles`.`name`, `articles`.`content`, `articles`.`subject`, `articles`.`likes`, `articles`.`enable`, `articles`.`report`, `articles`.`reason`, `users`.`last_name`, `users`.`first_name`, `users`.`patronymic`, `users`.`email`
FROM `articles`
INNER JOIN `article_user` ON `articles`.`id` = `article_user`.`id_article`
INNER JOIN `users` ON `users`.`id` = `article_user`.`id_user` WHERE `articles`.`enable`='0' OR `articles`.`report`='1'";
    $array = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

    if (count($array)) {
        foreach ($array as $key => $article) {
            $newArrayContent = [];
            $contents = json_decode($article[2]);

            foreach ($contents as $content) {
                if ($content->type === 'IMAGE') {
                    $id = $content->id;
                    $query = "SELECT * FROM `images` WHERE `id`='$id'";
                    $newArrayContent[] = [
                        'type' => 'IMAGE',
                        'content' => substr(mysqli_fetch_all(mysqli_query(dbconnect(), $query))[0][1], 1),
                    ];
                } else {
                    $newArrayContent[] = [
                        'type' => $content->type,
                        'content' => $content->content,
                    ];
                }
            }
            unset($article[2]);
            $article[2] = $newArrayContent;

            $query = "SELECT `subjects`.`name` FROM `subjects` WHERE `id`='$article[3]'";
            unset($article[3]);
            $article[3] = mysqli_fetch_all(mysqli_query(dbconnect(), $query))[0][0];

            $idArticle = $article[0];
            $query = "SELECT `comments`.`id`, `comments`.`text`, `comments`.`time`, `comments`.`likes`, `users`.`last_name`, `users`.`first_name`, `users`.`patronymic`, `users`.`email` FROM `article_comment`
INNER JOIN `comments` ON `article_comment`.`comment_id` = `comments`.`id`
INNER JOIN `users` ON `users`.`id` = `comments`.`author` WHERE `article_comment`.`article_id`='$idArticle' AND `comments`.`hide`='0';";
            $comments = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

            foreach ($comments as $key => $comment) {
                $commentId = $comment[0];
                $query = "SELECT `comment_like`.`user_id` FROM `comment_like` WHERE `comment_like`.`comment_id`='$commentId';";
                $comments[$key][] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
            }

            $article[] = $comments;

            $query = "SELECT `article_like`.`user_id` FROM `article_like` WHERE `article_like`.`article_id`='$idArticle';";
            $article[] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

            $array[$key] = $article;
        }

        return ['result' => $array, 'message' => 'Статьи успешно получены!', 'status' => true];
    }
    return ['result' => [], 'message' => 'Статьи успешно получены!', 'status' => true];
}

function acceptArticle($data) {
    $id = clearSQL($data['id']);

    $query = "UPDATE `articles` SET `enable` = '1', `report` = '0' WHERE `articles`.`id`='$id';";
    $check = mysqli_query(dbconnect(), $query);
    return ['result' => [], 'message' => $check ? 'Статья успешна одобрена!' : 'Ошибка одобрения статьи!', 'status' => $check];
}

function deleteSubject($data) {
    $id = clearSQL($data['id']);

    $query = "DELETE FROM `subjects` WHERE `subjects`.`id` = '$id';";
    $check = mysqli_query(dbconnect(), $query);
    return ['result' => [], 'message' => $check ? 'Тематика успешна удалена!' : 'Ошибка удаления тематики!', 'status' => $check];
}

function addSubject($data) {
    $name = clearSQL($data['name']);

    $query = "INSERT INTO `subjects` (`name`) VALUES ('$name');";
    $check = mysqli_query(dbconnect(), $query);
    return ['result' => [], 'message' => $check ? 'Тематика успешна добавлена!' : 'Ошибка добавления тематики!', 'status' => $check];
}

function hideArticle($data) {
    $id = clearSQL($data['id']);
    $text = clearSQL($data['text']);

    $query = "UPDATE `articles` SET `reason` = '$text', `report` = '1' WHERE `articles`.`id`='$id';";
    $check = mysqli_query(dbconnect(), $query);
    return ['result' => [], 'message' => $check ? 'Статья успешно скрыта!' : 'Ошибка скрытия статьи!', 'status' => $check];
}

function hideComment($data) {
    $id = clearSQL($data['id']);

    $query = "UPDATE `comments` SET `hide` = '1' WHERE `comments`.`id`='$id';";
    $check = mysqli_query(dbconnect(), $query);
    return ['result' => [], 'message' => $check ? 'Комментарий успешно скрыт!' : 'Ошибка скрытия комменатария!', 'status' => $check];
}

function sendMessage($data) {
    $idFrom = clearSQL($data['idFrom']);
    $idTo = clearSQL($data['idTo']);
    $text = clearSQL($data['text']);
    $time = getdate()[0];

    $query = "INSERT INTO `message` (`from_id`,`to_id`,`text`,`time`) VALUES ('$idFrom', '$idTo', '$text', '$time');";
    $check = mysqli_query(dbconnect(), $query);
    return ['result' => [], 'message' => $check ? 'Сообщение успешно отправлено!' : 'Ошибка отправки сообщения!', 'status' => $check];
}

function getMessage() {
    $query = "SELECT * FROM `message`;";
    $check = mysqli_query(dbconnect(), $query);
    return ['result' => mysqli_fetch_all($check), 'message' => '', 'status' => $check];
}

function createTour($data) {
    $name = clearSQL($data['name']);
    $image = clearSQL($data['image']);
    $description = clearSQL($data['description']);
    $city = clearSQL($data['city']);
    $dateStart = $data['dateStart'];
    $dateEnd = $data['dateEnd'];
    $price = $data['price'];

    $file = addImage($image);
    $path = clearSQL($file['path']);
    $type = clearSQL($file['type']);
    $size = clearSQL($file['size']);
    if (isset($path) && isset($type) && isset($size)) {
        $query = "INSERT INTO `images` (`path`, `type`, `size`) VALUES ('$path', '$type', '$size');";
        mysqli_query(dbconnect(), $query);
        $query = "SELECT * FROM `images` WHERE `path`='$path';";
        $scope = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
        $idFile = isset($scope[0]) ? isset($scope[0][0]) ? $scope[0][0] : 0 : 0;

        $query = "INSERT INTO `tours` (`name`, `image`, `description`, `city`, `date_start`, `date_end`, `price`) VALUES ('$name', '$idFile', '$description', '$city', '$dateStart', '$dateEnd', '$price');";
        $check = mysqli_query(dbconnect(), $query);
        return ['result' => [], 'message' => $check ? 'Тур успешно добавлен!' : 'Ошибка добавления тура!', 'status' => $check];
    }
    return ['result' => [], 'message' => 'Ошибка добавления тура!', 'status' => false];
}

function getTours() {
    $query = "SELECT `tours`.`id`, `tours`.`name`, `tours`.`image`, `tours`.`description`, `tours`.`city`, `tours`.`date_start`, `tours`.`date_end`, `tours`.`price`, `tours`.`likes`
FROM `tours` ORDER BY `tours`.`likes` DESC";
    $array = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

    if (count($array)) {
        foreach ($array as $key => $tour) {
            $id = $tour[2];
            $query = "SELECT * FROM `images` WHERE `id`='$id'";
            $path = substr(mysqli_fetch_all(mysqli_query(dbconnect(), $query))[0][1], 1);
            unset($tour[2]);
            $tour[2] = $path;

            $idTour = $tour[0];
            $query = "SELECT `comments`.`id`, `comments`.`text`, `comments`.`time`, `comments`.`likes`, `users`.`last_name`, `users`.`first_name`, `users`.`patronymic`, `users`.`email` FROM `tour_comment`
INNER JOIN `comments` ON `tour_comment`.`comment_id` = `comments`.`id`
INNER JOIN `users` ON `users`.`id` = `comments`.`author` WHERE `tour_comment`.`tour_id`='$idTour' AND `comments`.`hide`='0';";
            $comments = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

            foreach ($comments as $k => $comment) {
                $commentId = $comment[0];
                $query = "SELECT `comment_like`.`user_id` FROM `comment_like` WHERE `comment_like`.`comment_id`='$commentId';";
                $comments[$k][] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
            }

            $tour[] = $comments;

            $query = "SELECT `tour_like`.`user_id` FROM `tour_like` WHERE `tour_like`.`tour_id`='$idTour';";
            $tour[] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

            $query = "SELECT `tour_user`.`id_user` FROM `tour_user` WHERE `tour_user`.`id_tour`='$idTour';";
            $tour[] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

            $array[$key] = $tour;
        }

        return ['result' => $array, 'message' => 'Туры успешно получены!', 'status' => true];
    }
    return ['result' => [], 'message' => 'Туры успешно получены!', 'status' => true];
}

function signTour($data) {
    $idTour = clearSQL($data['idTour']);
    $idUser = clearSQL($data['idUser']);
    $isSet = $data['isSet'];

    if ($isSet === 'true') {
        $query = "INSERT INTO `tour_user` (`id_tour`,`id_user`) VALUES ('$idTour', '$idUser');";
        $check = mysqli_query(dbconnect(), $query);
    } else {
        $query = "DELETE FROM `tour_user` WHERE `tour_user`.`id_tour` = '$idTour' AND `tour_user`.`id_user` = '$idUser'";
        $check = mysqli_query(dbconnect(), $query);
    };

    $query = "SELECT * FROM `users` WHERE `id`='$idUser';";
    $user = mysqli_fetch_all(mysqli_query(dbconnect(), $query));
    $idUser = $user[0][0];
    $query = "SELECT `tour_user`.`id_tour` FROM `tour_user` WHERE `tour_user`.`id_user`='$idUser';";
    $user[0][] = mysqli_fetch_all(mysqli_query(dbconnect(), $query));

    return ['result' => $user[0], 'message' => $check ? ($isSet === 'true' ? 'Вы успешно записаны на тур!' : 'Вы успешно отписались от тура!') : 'Ошибка записи на курс!', 'status' => $check];
}

function unSignUser($data) {
    $idTour = clearSQL($data['idTour']);
    $idUser = clearSQL($data['idUser']);

    $query = "DELETE FROM `tour_user` WHERE `tour_user`.`id_tour` = '$idTour' AND `tour_user`.`id_user` = '$idUser'";
    $check = mysqli_query(dbconnect(), $query);

    return ['result' => [], 'message' => $check ? 'Пользователь успешно отписан от тура!' : 'Ошибка отписки пользователя от курса!', 'status' => $check];
}
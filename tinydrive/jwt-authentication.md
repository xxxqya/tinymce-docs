---
layout: default
title: Tiny Drive JWT Authentication
title_nav: JWT Authentication
description: Guide on how to setup JWT Authentication for Tiny Drive
keywords: jwt authentication
---

## Audience

This section is intended to be used by developers with prior knowledge of [JSON Web Token](https://jwt.io/) (or JWT) in detail, including how they can be used for user authentication and session management in a web application. There will be some coding involved on both the client-side and the server-side to configure JWT as per the instructions in this section.

## Introduction

Tiny Drive require you to setup JWT authentication. This allows us to verify that you and your end user are allowed to access a particular feature. JWT is a common authorization solution for web services and is documented in more detail at the [https://jwt.io/](https://jwt.io/) website. The guide aims to show how to setup JWT authentication for Tiny Drive.

## Private/public key pair

Tokens used by the TinyMCE cloud services make use of a public/private RSA key-pair. This allows you as an integrator to have full control over the authentication as we don't store the private key. Only you have access to the private key, and only you can produce valid tokens. We can only verify that they are valid and extract user information from that token.

The private/public key pair is created in your [Tiny account page](https://apps.tiny.cloud/my-account/jwt-key-manager/), but we only store the public key on our side. The private key is for you to store in your backend.

## JWT provider URL

The easiest way to setup JWT authentication against TinyMCE cloud services is to create a JWT provider endpoint. This endpoint takes a JSON HTTP POST request and produces a JSON result with the token that the service will then use for all the HTTP requests.

The following diagram explains the JWT call flow:

![JSON Web Token Call Flow]({{site.baseurl}}/images/jwt-call-flow.png "JSON Web Token Call Flow")

## JWT requirements

### Algorithm

The following algorithms are supported for the JWT header/signature:

* RS256
* RS384
* RS512
* PS256
* PS384
* PS512

All of these algorithms use the private RSA key to sign the JWT, but vary in how they execute. `RS256`, the most widely supported algorithm, features in following code examples.

### Claims

* **sub** - _(required)_ Unique string to identify the user. This can be a database ID, hashed email address, or similar identifier.
* **name** - _(required)_ Full name of the user that will be used for presentation inside Tiny Drive. When the user uploads a file, this name is presented as the creator of that file.
* **https://claims.tiny.cloud/drive/root** - (optional) Full path to a tiny drive specific root for example "/johndoe". The user won't be able to see or manage files outside this configured root path.

## PHP token provider example

This example uses the [Firebase JWT library](https://github.com/firebase/php-jwt) provided through the Composer dependency manager. The private key should be the private key that was generated through your Tiny Account. Each service requires different claims to be provided. The following example shows the sub and name claims needed for Tiny Drive.

```php
<?php
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$privateKey = <<<EOD
-----BEGIN PRIVATE KEY-----
....
-----END PRIVATE KEY-----
EOD;

$payload = array(
  // Unique user id string
  "sub" => "123",

  // Full name of user
  "name" => "John Doe",

  // Optional custom user root path
  // "https://claims.tiny.cloud/drive/root" => "/johndoe",

  // 10 minutes expiration
  "exp" => time() + 60 * 10
);

try {
  $token = JWT::encode($payload, $privateKey, 'RS256');
  http_response_code(200);
  header('Content-Type: application/json');
  echo json_encode(array("token" => $token));
} catch (Exception $e) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo $e->getMessage();
}
?>
```

## Node token provider example

This example shows you how to set up a Node.js express handler that produces the tokens. It requires you to install the Express web framework and the `jsonwebtoken` Node modules. Each service requires different claims to be provided. The following example shows the sub and name claims needed for Tiny Drive.

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());

const privateKey = `
-----BEGIN PRIVATE KEY-----
....
-----END PRIVATE KEY-----
`;

app.post('/jwt', function (req, res) {
  const payload = {
    // Unique user id string
    sub: '123',

    // Full name of user
    name: 'John Doe',

    // Optional custom user root path
    // 'https://claims.tiny.cloud/drive/root': '/johndoe',

    // 10 minutes expiration
    exp: Math.floor(Date.now() / 1000) + (60 * 10)
  };

  try {
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256'});
    res.set('content-type', 'application/json');
    res.status(200);
    res.send(JSON.stringify({
      token: token
    }));
  } catch (e) {
    res.status(500);
    res.send(e.message);
  }
});

app.listen(3000);
```
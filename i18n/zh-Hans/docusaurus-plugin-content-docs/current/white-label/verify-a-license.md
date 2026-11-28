---
title: 核验授权
sidebar_label: 核验授权
description: 了解如何用授权密钥或运行域名核验Rent Party白标版，以及各种查询结果的含义。
topics: [white-label]
sidebar_position: 5
last_update:
  date: 2026-11-13
---

任何人都可以在[授权核验页面](https://rentparty.aoneahsan.com/verify-license)查询Rent Party白标版。查询由我们的授权服务处理。

## 如何用密钥核验？ {#by-key}

输入授权密钥，前缀为`RENTPARTY-WL-`。结果会显示授权是有效、配置中还是已撤销，以及持有人、域名、平台和更新期结束日期等公开信息。邮箱和价格不会显示。

## 如何用域名核验？ {#by-domain}

输入域名，例如`play.yourbrand.com`。每个获得授权的部署版本都会在`/.well-known/rentparty-white-label-license.json`提供授权文件，核验服务会读取该文件及其指向的授权。

## 查询结果是什么意思？ {#answers}

| 结果 | 含义 |
|---|---|
| 有效 | 授权有效。 |
| 配置中 | 授权已发放，但部署版本尚未上线。 |
| 已撤销 | 因使用超出授权条款，授权已终止。 |
| 域名未获授权 | 域名有授权文件，但相应授权不涵盖该域名。 |
| 无授权文件 | 此域名未提供Rent Party授权文件。 |

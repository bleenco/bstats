# bstats

Server statistics built on top of RxJS

### Install

```
npm install bstats -g
```

### Configuration & Running

On initial run `~/.bstats.json` is created. Here you configure your SSL certificates and ports on which server is running on.

#### Run The Application

```sh
bstats
```

If you want to run this continuously we recommend using `pm2` or `forever`.

### Technology Stack

`bstats` is made on top of

- NodeJS (server side)
- RxJS (both server and client side)
- Angular4 (client side)

### Developing on bstats

```sh
git clone https://github.com/bleenco/bstats.git
cd bstats
npm run dev # run server build

# open another terminal tab/window and run
npm run start # this starts UI development
```

### Preview

<p align="center">
  <img src="https://user-images.githubusercontent.com/1796022/27514376-0014a7f0-5989-11e7-9ff2-06768014ef1e.png" width="700">
</p>

### Licence

MIT

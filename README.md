# Personal DNS zones

DNS records for several personal domains, managed as code with
[DNSControl](https://docs.dnscontrol.org/) and deployed to
[deSEC](https://desec.io/) through GitHub Actions.

## Managed zones

| Zone | Purpose |
| --- | --- |
| `kiefer-networks.de` | Web (GitHub Pages) and mail via SimpleLogin |
| `debgen.org` | Web (GitHub Pages) and mail via SimpleLogin |
| `lighthouse-bayreuth.de` | Web and Microsoft 365 mail |
| `lighthouse-franken.de` | Web and Microsoft 365 mail |
| `lighthouse-kirche.de` | Web and Microsoft 365 mail |
| `lighthouse-kirchen.de` | Web and Microsoft 365 mail |
| `lighthouse-kronach.de` | Web and Microsoft 365 mail |
| `mailgermania.de` | SimpleLogin mail |
| `p37.nexus` | Mail via SimpleLogin |
| `pinlo.me` | Mail via SimpleLogin, wildcard to NetBird |

## How it works

- [`dnsconfig.js`](dnsconfig.js) — the single source of truth for every DNS
  record (web, mail, SPF/DKIM/DMARC, TXT verification).
- [`creds.json`](creds.json) — provider configuration. It holds no secrets: the
  deSEC token is read at runtime from the `DESEC_TOKEN` environment variable.
- [`.github/workflows/dns.yml`](.github/workflows/dns.yml) — CI/CD pipeline.

Any change to the config is validated and previewed automatically. Once merged
into `main`, the records are pushed to the live zone.

## Pipeline

A single `deploy` job runs on every trigger.

| Trigger | `dnscontrol check` | `dnscontrol preview` | `dnscontrol push` |
| --- | --- | --- | --- |
| Pull request | yes | yes | no |
| Push to `main` | yes | no | yes |
| Manual dispatch | yes | no | yes |

Pull requests run in no environment. Pushes and manual runs use the `production`
environment. Runs are serialized through the `dns-deploy` concurrency group.

The latest `dnscontrol` release is installed on each run (`go install ...@latest`).

## Setup

1. Create a deSEC API token.
2. Add it as a repository secret named `DESEC_TOKEN`.
3. Create a GitHub environment named `production` (used by pushes and manual runs).

## Local usage

```sh
export DESEC_TOKEN="your-token"

dnscontrol check     # validate the configuration
dnscontrol preview   # show the diff against the live zone
dnscontrol push      # apply the changes
```

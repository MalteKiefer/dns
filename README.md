# Personal DNS zones

DNS records for several personal domains, managed as code with
[DNSControl](https://docs.dnscontrol.org/) and deployed to
[deSEC](https://desec.io/) through GitHub Actions.

## Managed zones

| Zone | Purpose |
| --- | --- |
| `kiefer-networks.de` | Web and self-hosted mail (SPF/DKIM/DMARC, MTA-STS, DANE, SRV) |
| `lighthouse-bayreuth.de` | Web and Microsoft 365 mail |
| `lighthouse-franken.de` | Web only |
| `lighthouse-kirche.de` | Web and Microsoft 365 mail |
| `lighthouse-kirchen.de` | Web and Microsoft 365 mail |
| `lighthouse-kronach.de` | Web and Microsoft 365 mail |
| `mailgermania.de` | SimpleLogin mail |
| `p37.nexus` | Internal zone, mail relayed through `kiefer-networks.de` |

## How it works

- [`dnsconfig.js`](dnsconfig.js) — the single source of truth for every DNS
  record (web, mail, SPF/DKIM/DMARC, MTA-STS, DANE, SRV and CAA).
- [`creds.json`](creds.json) — provider configuration. It holds no secrets: the
  deSEC token is read at runtime from the `DESEC_TOKEN` environment variable.
- [`.github/workflows/dns.yml`](.github/workflows/dns.yml) — CI/CD pipeline.

Any change to the config is validated and previewed automatically. Once merged
into `main`, the records are pushed to the live zone.

## Pipeline

| Trigger | `preview` job | `push` job |
| --- | --- | --- |
| Pull request | runs `dnscontrol check` + `preview` | skipped |
| Push to `main` | runs `dnscontrol check` + `preview` | runs `dnscontrol push` |
| Manual dispatch | runs `dnscontrol check` + `preview` | runs `dnscontrol push` |

The latest `dnscontrol` release is installed on each run, so the pipeline always
tracks the current version.

## Setup

1. Create a deSEC API token.
2. Add it as a repository secret named `DESEC_TOKEN`.
3. Create a GitHub environment named `production` (used by the `push` job).

## Local usage

```sh
export DESEC_TOKEN="your-token"

dnscontrol check     # validate the configuration
dnscontrol preview   # show the diff against the live zone
dnscontrol push      # apply the changes
```

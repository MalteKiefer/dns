// Registrar is managed outside of DNSControl, so use the built-in no-op registrar.
var REG_INWX = NewRegistrar("none");
// DNS records are hosted at deSEC.
var DSP_DESEC = NewDnsProvider("desec");

// deSEC nameservers shared by every zone below.
var DESEC_NS = [
    NAMESERVER("ns1.desec.io."),
    NAMESERVER("ns2.desec.org."),
];

// ---------------------------------------------------------------------------
// kiefer-networks.de
// ---------------------------------------------------------------------------

var DOMAIN = "kiefer-networks.de";

// Server addresses.
var IP4_WEB  = "152.53.102.158";
var IP6_WEB  = "2a0a:4cc0:80:23ca:18b7:e0ff:fe0b:ef74";
var IP4_MAIL = "152.53.156.62";
var IP6_MAIL = "2a0a:4cc0:c2:78e1:e8dd:7eff:fe13:2b56";

D(DOMAIN, REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(86400),
    DESEC_NS,

    // Web
    A("@", IP4_WEB),
    AAAA("@", IP6_WEB),
    A("www", IP4_WEB),
    AAAA("www", IP6_WEB),
    A("*", IP4_WEB),
    AAAA("*", IP6_WEB),

    // Mail
    A("mail", IP4_MAIL),
    AAAA("mail", IP6_MAIL),
    MX("@", 10, "mail." + DOMAIN + "."),
    CNAME("autoconfig", "mail." + DOMAIN + "."),
    CNAME("autodiscover", "mail." + DOMAIN + "."),

    // MTA-STS policy host
    A("mta-sts", IP4_MAIL),
    AAAA("mta-sts", IP6_MAIL),

    // SPF / DKIM / DMARC
    TXT("@", "v=spf1 mx -all"),
    TXT("mail2026._domainkey", "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAutMr4fhaKrvoRdnSkQ50wUvakIxhyJEydgP3bXfmuCJ0bcGuHJ3EZQZkDcUV4g2t04rF7x+XdE1cTDAVm7hCH1sTsOxKm9CW039ApesPZNNMVr5kdECfBSFdY/Q264UPForgcGhseB4o7FVv15N2LF01FglRI5JQSvBQ+gQCOYoVOTtfxxE/C5gAu69fycqEyYQsJTx2GOCaa9jIika1DYjr5PHeJn/8UVOuairQCMX2oOkfPGsZQgOzaTv+ep81TFrV0VhphU55CE9taiovu7Gsu1kDQIxHkeiyKVJMBxK+WXywdV7q2qJhVhBOHM9vo/alBsSoIN+5DGg0BY+6lwIDAQAB"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@" + DOMAIN + "; ruf=mailto:dmarc@" + DOMAIN + "; fo=1; adkim=s; aspf=s; pct=100"),

    // MTA-STS / TLS-RPT
    TXT("_mta-sts", "v=STSv1; id=20260714200719"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@" + DOMAIN),

    // DANE
    TLSA("_25._tcp.mail", 3, 1, 1, "9977fe971e2c6dbdb453439320cc079877eadbf9f0201b9f7ef4aa12ef2e218d", TTL(3600)),

    // SRV
    SRV("_autodiscover._tcp", 0, 1, 443, "mail." + DOMAIN + "."),
    SRV("_imaps._tcp", 0, 1, 993, "mail." + DOMAIN + "."),
    SRV("_submissions._tcp", 0, 1, 465, "mail." + DOMAIN + "."),

    // CAA
    CAA("@", "issue", "letsencrypt.org", CAA_CRITICAL),
    CAA("*", "issue", "letsencrypt.org", CAA_CRITICAL)
);

// ---------------------------------------------------------------------------
// lighthouse-bayreuth.de (Microsoft 365 mail)
// ---------------------------------------------------------------------------

D("lighthouse-bayreuth.de", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(86400),
    DESEC_NS,

    // Web
    A("@", "84.200.227.133"),
    AAAA("@", "2001:1608:23:8:0:1:0:1"),
    A("www", "84.200.227.133"),
    AAAA("www", "2001:1608:23:8:0:1:0:1"),

    // Mail (Exchange Online)
    MX("@", 0, "lighthousebayreuth-de02e.mail.protection.outlook.com."),
    TXT("@", "v=spf1 include:spf.protection.outlook.com -all"),
    TXT("_dmarc", "v=DMARC1; p=none; rua=mailto:dmarc@lighthouse-bayreuth.de; adkim=s; aspf=s"),
    CNAME("autodiscover", "autodiscover.outlook.com."),
    CNAME("selector1._domainkey", "selector1-lighthousebayreuth-de02e._domainkey.fcgbayreuth.onmicrosoft.com."),
    CNAME("selector2._domainkey", "selector2-lighthousebayreuth-de02e._domainkey.fcgbayreuth.onmicrosoft.com."),

    // Microsoft device management / enrollment
    CNAME("enterpriseenrollment", "enterpriseenrollment-s.manage.microsoft.com."),
    CNAME("enterpriseregistration", "enterpriseregistration.windows.net.")
);

// ---------------------------------------------------------------------------
// lighthouse-franken.de
// ---------------------------------------------------------------------------

D("lighthouse-franken.de", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(86400),
    DESEC_NS,

    // Web
    A("@", "84.200.227.133"),
    AAAA("@", "2001:1608:23:8:0:1:0:1"),
    A("www", "84.200.227.133"),
    AAAA("www", "2001:1608:23:8:0:1:0:1"),

    // Mail (Exchange Online)
    MX("@", 0, "lighthousefranken-de02e.mail.protection.outlook.com."),
    // The @ TXT RRset shares one TTL, so keep both records at 3600.
    TXT("@", "v=spf1 include:spf.protection.outlook.com -all", TTL(3600)),
    TXT("@", "MS=ms27590614", TTL(3600)),
    TXT("_dmarc", "v=DMARC1; p=none; rua=mailto:dmarc@lighthouse-franken.de; adkim=s; aspf=s"),
    CNAME("autodiscover", "autodiscover.outlook.com."),
    CNAME("selector1._domainkey", "selector1-lighthousefranken-de02e._domainkey.fcgbayreuth.q-v1.dkim.mail.microsoft."),
    CNAME("selector2._domainkey", "selector2-lighthousefranken-de02e._domainkey.fcgbayreuth.q-v1.dkim.mail.microsoft."),

    // Microsoft device management / enrollment
    CNAME("enterpriseenrollment", "enterpriseenrollment-s.manage.microsoft.com."),
    CNAME("enterpriseregistration", "enterpriseregistration.windows.net.")
);

// ---------------------------------------------------------------------------
// lighthouse-kirche.de (Microsoft 365 mail)
// ---------------------------------------------------------------------------

D("lighthouse-kirche.de", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(86400),
    DESEC_NS,

    // Web
    A("@", "84.200.227.133"),
    AAAA("@", "2001:1608:23:8:0:1:0:1"),
    A("www", "84.200.227.133"),
    AAAA("www", "2001:1608:23:8:0:1:0:1"),

    // Mail (Exchange Online)
    MX("@", 0, "lighthousekirche-de02e.mail.protection.outlook.com."),
    TXT("@", "v=spf1 include:spf.protection.outlook.com -all"),
    TXT("@", "MS=ms75357718"),
    TXT("_dmarc", "v=DMARC1; p=none; rua=mailto:dmarc@lighthouse-kirche.de; adkim=s; aspf=s"),
    CNAME("autodiscover", "autodiscover.outlook.com."),
    CNAME("selector1._domainkey", "selector1-lighthousekirche-de02e._domainkey.fcgbayreuth.y-v1.dkim.mail.microsoft."),
    CNAME("selector2._domainkey", "selector2-lighthousekirche-de02e._domainkey.fcgbayreuth.y-v1.dkim.mail.microsoft."),

    // Microsoft device management / enrollment
    CNAME("enterpriseenrollment", "enterpriseenrollment-s.manage.microsoft.com."),
    CNAME("enterpriseregistration", "enterpriseregistration.windows.net.")
);

// ---------------------------------------------------------------------------
// lighthouse-kirchen.de (Microsoft 365 mail)
// ---------------------------------------------------------------------------

D("lighthouse-kirchen.de", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(86400),
    DESEC_NS,

    // Web
    A("@", "84.200.227.133"),
    AAAA("@", "2001:1608:23:8:0:1:0:1"),
    A("www", "84.200.227.133"),
    AAAA("www", "2001:1608:23:8:0:1:0:1"),

    // Mail (Exchange Online)
    MX("@", 0, "lighthousekirchen-de02e.mail.protection.outlook.com."),
    TXT("@", "v=spf1 include:spf.protection.outlook.com -all"),
    TXT("@", "MS=ms93567930"),
    TXT("_dmarc", "v=DMARC1; p=none; rua=mailto:dmarc@lighthouse-kirchen.de; adkim=s; aspf=s"),
    CNAME("autodiscover", "autodiscover.outlook.com."),
    CNAME("selector1._domainkey", "selector1-lighthousekirchen-de02e._domainkey.fcgbayreuth.y-v1.dkim.mail.microsoft."),
    CNAME("selector2._domainkey", "selector2-lighthousekirchen-de02e._domainkey.fcgbayreuth.y-v1.dkim.mail.microsoft."),

    // Microsoft device management / enrollment
    CNAME("enterpriseenrollment", "enterpriseenrollment-s.manage.microsoft.com."),
    CNAME("enterpriseregistration", "enterpriseregistration.windows.net.")
);

// ---------------------------------------------------------------------------
// lighthouse-kronach.de (Microsoft 365 mail)
// ---------------------------------------------------------------------------

D("lighthouse-kronach.de", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(86400),
    DESEC_NS,

    // Web
    A("@", "84.200.227.133"),
    AAAA("@", "2001:1608:23:8:0:1:0:1"),
    A("www", "84.200.227.133"),
    AAAA("www", "2001:1608:23:8:0:1:0:1"),

    // Mail (Exchange Online)
    MX("@", 0, "lighthousekronach-de02e.mail.protection.outlook.com."),
    TXT("@", "v=spf1 include:spf.protection.outlook.com -all"),
    TXT("@", "MS=ms24832700"),
    TXT("_dmarc", "v=DMARC1; p=none; rua=mailto:dmarc@lighthouse-kronach.de; adkim=s; aspf=s"),
    CNAME("autodiscover", "autodiscover.outlook.com."),
    CNAME("selector1._domainkey", "selector1-lighthousekronach-de02e._domainkey.fcgbayreuth.p-v1.dkim.mail.microsoft."),
    CNAME("selector2._domainkey", "selector2-lighthousekronach-de02e._domainkey.fcgbayreuth.p-v1.dkim.mail.microsoft."),

    // Microsoft device management / enrollment
    CNAME("enterpriseenrollment", "enterpriseenrollment-s.manage.microsoft.com."),
    CNAME("enterpriseregistration", "enterpriseregistration.windows.net."),

    // deSEC servfail challenge token
    TXT("_servfail-challenge", ".RAuOQuyZYgkyya508M5TNb79vEmA", TTL(3600))
);

// ---------------------------------------------------------------------------
// mailgermania.de (SimpleLogin mail)
// ---------------------------------------------------------------------------

D("mailgermania.de", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(3600),
    DESEC_NS,

    // Web
    A("*", "82.211.19.16"),

    // Mail (SimpleLogin)
    MX("@", 10, "mx1.simplelogin.co."),
    MX("@", 20, "mx2.simplelogin.co."),
    CNAME("dkim._domainkey", "dkim._domainkey.simplelogin.co."),
    CNAME("dkim02._domainkey", "dkim02._domainkey.simplelogin.co."),
    CNAME("dkim03._domainkey", "dkim03._domainkey.simplelogin.co."),

    // SPF / DMARC
    TXT("@", "v=spf1 include:simplelogin.co ~all"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; pct=100; adkim=s; aspf=s")
);

// ---------------------------------------------------------------------------
// p37.nexus (internal zone, mail relayed through kiefer-networks.de)
// ---------------------------------------------------------------------------

D("p37.nexus", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(3600),
    DESEC_NS,

    // Web
    A("@", IP4_WEB),
    AAAA("@", IP6_WEB),
    A("*", IP4_WEB, TTL(10800)),

    // Mail (relayed through kiefer-networks.de)
    MX("@", 10, "mail.kiefer-networks.de."),
    CNAME("autoconfig", "mail.kiefer-networks.de."),
    CNAME("autodiscover", "mail.kiefer-networks.de."),

    // MTA-STS policy host
    A("mta-sts", IP4_MAIL),
    AAAA("mta-sts", IP6_MAIL),

    // SPF / DKIM / DMARC
    TXT("@", "v=spf1 mx -all"),
    TXT("mail2026._domainkey", "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkrwqWJMb0pLWYyCRKZJWaEu9QpZ/f9sHioStDdEaiwWNcbZPiceGkKZlrfjuUt8xRZTZD6uT/PW2xZGL8TztaA/iWyJKvHMFtLxPKX+s3ILpNKf+Wj4M3xzm2coDN+dkVRxUF1X8Ci2/Ms+n0E2RE6m0aUnzIj0/pn6eR4Uv6pih2gBdDTr1jrz6rFhf9RgsiS9A3flev3eiQ7S8/GQM7PgN5Nn9ncCe9EjpFXlUCUefwNgYvTNO7x+nrv5KBDuAfV0RxRBnZyZ0qGK5ZJcKn9RHT0Gb4N6qinOMSr63QNGXQCLiI2dMr779cqU85uuYdHmHc0mtGfZg6ZzHAFHfIwIDAQAB"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@p37.nexus; ruf=mailto:dmarc@p37.nexus; fo=1; adkim=s; aspf=s; pct=100"),

    // MTA-STS / TLS-RPT
    TXT("_mta-sts", "v=STSv1; id=20260714200634"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@p37.nexus"),

    // SRV
    SRV("_autodiscover._tcp", 0, 1, 443, "mail.kiefer-networks.de."),
    SRV("_imaps._tcp", 0, 1, 993, "mail.kiefer-networks.de."),
    SRV("_submissions._tcp", 0, 1, 465, "mail.kiefer-networks.de.")
);

// ---------------------------------------------------------------------------
// in.box (personal zone, mail relayed through kiefer-networks.de)
// ---------------------------------------------------------------------------

D("in.box", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(3600),
    DESEC_NS,

    // Web
    A("@", IP4_WEB),
    AAAA("@", IP6_WEB),
    A("*", IP4_WEB, TTL(10800)),

    // Mail (relayed through kiefer-networks.de)
    MX("@", 10, "mail.kiefer-networks.de."),
    CNAME("autoconfig", "mail.kiefer-networks.de."),
    CNAME("autodiscover", "mail.kiefer-networks.de."),

    // MTA-STS policy host
    A("mta-sts", IP4_MAIL),
    AAAA("mta-sts", IP6_MAIL),

    // SPF / DKIM / DMARC
    TXT("@", "v=spf1 mx -all"),
    // DKIM — add the mail2026 public key here once mailadmin generates it for in.box:
    //   TXT("mail2026._domainkey", "v=DKIM1; k=rsa; p=..."),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@in.box; ruf=mailto:dmarc@in.box; fo=1; adkim=s; aspf=s; pct=100"),

    // MTA-STS / TLS-RPT
    TXT("_mta-sts", "v=STSv1; id=20260723000000"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@in.box"),

    // SRV
    SRV("_autodiscover._tcp", 0, 1, 443, "mail.kiefer-networks.de."),
    SRV("_imaps._tcp", 0, 1, 993, "mail.kiefer-networks.de."),
    SRV("_submissions._tcp", 0, 1, 465, "mail.kiefer-networks.de.")
);

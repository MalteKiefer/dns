// Registrar is managed outside of DNSControl, so use the built-in no-op registrar.
var REG_INWX = NewRegistrar("none");
// DNS records are hosted at deSEC.
var DSP_DESEC = NewDnsProvider("desec");

// deSEC reports its own nameservers (ns1.desec.io / ns2.desec.org), and
// DnsProvider(DSP_DESEC) without an nsCount already turns them into the apex NS
// records. Declaring them again with NAMESERVER() would append a second copy:
// deSEC stores NS as one RRset, so the duplicate targets make it reject the
// whole bulk request ("Duplicate: records must be semantically unique").
//
// So only pin the TTL here. AddNSRecords() defaults to 300 (it ignores
// DefaultTTL) which deSEC raises to the zone minimum, producing endless NS
// churn; 3600 matches what deSEC already serves, so the RRset stays untouched.
var DESEC_NS_TTL = NAMESERVER_TTL("3600");

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
    DESEC_NS_TTL,

    // Web
    A("@", IP4_WEB),
    AAAA("@", IP6_WEB),
    A("www", IP4_WEB),
    AAAA("www", IP6_WEB),

    // Mail
    CNAME("*", "eu1.netbird.services."),
    A("mail", IP4_MAIL),
    AAAA("mail", IP6_MAIL),
    MX("@", 0, "kiefernetworks-de01e.mail.protection.outlook.com."),
    CNAME("autodiscover", "autodiscover.outlook.com."),
    CNAME("enterpriseregistration", "enterpriseregistration.windows.net."),
    CNAME("enterpriseenrollment", "enterpriseenrollment-s.manage.microsoft.com."),
    CNAME("selector1._domainkey", "selector1-kiefernetworks-de01e._domainkey.TrinexaConsulting.r-v1.dkim.mail.microsoft."),
    CNAME("selector2._domainkey", "selector2-kiefernetworks-de01e._domainkey.TrinexaConsulting.r-v1.dkim.mail.microsoft."),

    // TXT
    TXT("@", "v=spf1 include:spf.protection.outlook.com -all"),
);

// ---------------------------------------------------------------------------
// lighthouse-bayreuth.de (Microsoft 365 mail)
// ---------------------------------------------------------------------------

D("lighthouse-bayreuth.de", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(86400),
    DESEC_NS_TTL,

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
    DESEC_NS_TTL,

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
    DESEC_NS_TTL,

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
    DESEC_NS_TTL,

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
    DESEC_NS_TTL,

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
    DESEC_NS_TTL,

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
    DESEC_NS_TTL,

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

    // TXT
    TXT("@", "v=spf1 mx -all"),
    TXT("mail2026._domainkey", "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkrwqWJMb0pLWYyCRKZJWaEu9QpZ/f9sHioStDdEaiwWNcbZPiceGkKZlrfjuUt8xRZTZD6uT/PW2xZGL8TztaA/iWyJKvHMFtLxPKX+s3ILpNKf+Wj4M3xzm2coDN+dkVRxUF1X8Ci2/Ms+n0E2RE6m0aUnzIj0/pn6eR4Uv6pih2gBdDTr1jrz6rFhf9RgsiS9A3flev3eiQ7S8/GQM7PgN5Nn9ncCe9EjpFXlUCUefwNgYvTNO7x+nrv5KBDuAfV0RxRBnZyZ0qGK5ZJcKn9RHT0Gb4N6qinOMSr63QNGXQCLiI2dMr779cqU85uuYdHmHc0mtGfZg6ZzHAFHfIwIDAQAB"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@p37.nexus; ruf=mailto:dmarc@p37.nexus; fo=1; adkim=s; aspf=s; pct=100"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@p37.nexus"),

    // SRV
    SRV("_autodiscover._tcp", 0, 1, 443, "mail.kiefer-networks.de."),
    SRV("_imaps._tcp", 0, 1, 993, "mail.kiefer-networks.de."),
    SRV("_submissions._tcp", 0, 1, 465, "mail.kiefer-networks.de.")
);
// ---------------------------------------------------------------------------
// pinlo.me (internal zone, mail relayed through kiefer-networks.de)
// ---------------------------------------------------------------------------

D("pinlo.me", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(3600),
    DESEC_NS_TTL,

    // Web
    A("@", IP4_WEB),
    AAAA("@", IP6_WEB),
    CNAME("*", "eu1.netbird.services."),

    // Mail (relayed through kiefer-networks.de)
    MX("@", 10, "mail.kiefer-networks.de."),
    CNAME("autoconfig", "mail.kiefer-networks.de."),
    CNAME("autodiscover", "mail.kiefer-networks.de."),

    // MTA-STS policy host
    A("mta-sts", IP4_MAIL),
    AAAA("mta-sts", IP6_MAIL),

    // TXT
    TXT("@", "v=spf1 mx -all"),
    TXT("mail2026._domainkey", "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnK4gNz44aLwywE2NsOcXNjkkIcGuLopxp9TzbExqcVGkJj2yK5KDr7CzyW2IejeacYaMaGeyskCtFukxJrJaiyHtk70YliX7fwDNMozFZnVe0mvxeWD1WC3lXX6WvEVsO3Qo/QUagXgFUUfUmUg7lG2K0bRhguyMMv1QYiJlcUt5Fr+xgo7K3suVCQbHdu5iIOoPxCUgmjMANbU87/idHbQ3PrYFuUt6plVthabBevdvBpaWukRZuudEJWZHiV132egCVst9YoCF3c4MVRJ9RcbFsW/dJpUArXfHiM7ph/xPagodieBNvfV64TDmHdrVzBfxDwF0tExefVq+t8b6owIDAQAB"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@pinlo.me; ruf=mailto:dmarc@pinlo.me; fo=1; adkim=s; aspf=s; pct=100"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@pinlo.me"),

    // SRV
    SRV("_autodiscover._tcp", 0, 1, 443, "mail.kiefer-networks.de."),
    SRV("_imaps._tcp", 0, 1, 993, "mail.kiefer-networks.de."),
    SRV("_submissions._tcp", 0, 1, 465, "mail.kiefer-networks.de.")
);

// ---------------------------------------------------------------------------
// debgen.org
// ---------------------------------------------------------------------------

D("debgen.org", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(3600),
    DESEC_NS_TTL,

    // Web
    A("@", "185.199.108.153"),
    A("@", "185.199.109.153"),
    A("@", "185.199.110.153"),
    A("@", "185.199.111.153"),
    AAAA("@", "2606:50c0:8000::153"),
    AAAA("@", "2606:50c0:8001::153"),
    AAAA("@", "2606:50c0:8002::153"),
    AAAA("@", "2606:50c0:8003::153"),

    CNAME("www", "maltekiefer.github.io."),

    // Mail (relayed through kiefer-networks.de)
    MX("@", 10, "mail.kiefer-networks.de."),
    CNAME("autoconfig", "mail.kiefer-networks.de."),
    CNAME("autodiscover", "mail.kiefer-networks.de."),

    // MTA-STS policy host
    A("mta-sts", IP4_MAIL),
    AAAA("mta-sts", IP6_MAIL),

    // TXT
    TXT("@", "v=spf1 mx -all"),
    TXT("mail2026._domainkey", "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8TK70bUnmMGvHbt4JYirGQOSz34If6lThP06DchaaowYM4z6WJH5ivTnrFeL6nrytZCIPHkUSfyoONkjkCAadLNBwyiuIrWgs4EEXw/NyvzNhLvWskv10QMzQ9EsceMemY/5ca79EU43DPBUsjtmFPL5U/cg9jh0h8aYwTqUS+3af+1jDAWaBp1hVPxDyVrGyFfPK9scwG3inbaudLu3c7NTYhOl9XXjkIJtbMVCcF9QiCSuXPINyNflYeC++fR1DtSMkrcGu77894jLF60gJF0/+tc3Rt3YvS4ONIvVApCpq8zDyM3XNm5nBpnVWJsXFZn+Xd9pV2uerAblOmxtZwIDAQAB"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@debgen.org; ruf=mailto:dmarc@debgen.org; fo=1; adkim=s; aspf=s; pct=100"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@debgen.org"),

    // SRV
    SRV("_autodiscover._tcp", 0, 1, 443, "mail.kiefer-networks.de."),
    SRV("_imaps._tcp", 0, 1, 993, "mail.kiefer-networks.de."),
    SRV("_submissions._tcp", 0, 1, 465, "mail.kiefer-networks.de.")
);


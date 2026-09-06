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
// kiefer-networks.de (mail at mailbox.org)
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

    // NetBird wildcard
    CNAME("*", "eu1.netbird.services."),
	
    // Sites
    A("auth", IP4_WEB),
    AAAA("auth", IP6_WEB),
    A("search", IP4_WEB),
    AAAA("search", IP6_WEB),
    A("time", IP4_WEB),
    AAAA("time", IP6_WEB),
    A("mon", IP4_WEB),
    AAAA("mon", IP6_WEB),
	A("docs", IP4_WEB),
    AAAA("docs", IP6_WEB),
	A("photos", IP4_WEB),
    AAAA("photos", IP6_WEB),
	A("stats", IP4_WEB),
    AAAA("stats", IP6_WEB),
	A("sync", IP4_WEB),
    AAAA("sync", IP6_WEB),

    // Mail server host: mail is served by mailbox.org now, the box itself
    // stays reachable under this name.
    A("mail", IP4_MAIL),
    AAAA("mail", IP6_MAIL),

    // Mail (mailbox.org custom domain)
    MX("@", 10, "mxext1.mailbox.org."),
    MX("@", 10, "mxext2.mailbox.org."),
    MX("@", 10, "mxext3.mailbox.org."),
    MX("@", 10, "mxext4.mailbox.org."),

    // DKIM: mailbox.org holds the keys, the CNAMEs let them rotate without
    // a DNS change here. Lowercase on purpose - DNS is case-insensitive and
    // deSEC normalises anyway, so this avoids diff churn.
    CNAME("mbo0001._domainkey", "mbo0001._domainkey.mailbox.org."),
    CNAME("mbo0002._domainkey", "mbo0002._domainkey.mailbox.org."),
    CNAME("mbo0003._domainkey", "mbo0003._domainkey.mailbox.org."),
    CNAME("mbo0004._domainkey", "mbo0004._domainkey.mailbox.org."),

    // TXT
    // mailbox.org documents ~all; kept at -all since all outbound goes there.
    TXT("@", "v=spf1 include:mailbox.org -all"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@kiefer-networks.de; ruf=mailto:dmarc@kiefer-networks.de; fo=1; adkim=s; aspf=s; pct=100"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@kiefer-networks.de"),

    // mailbox.org domain verification
    TXT("6ae9c48470696c7c52507e8c3ae83e0d888df6c7", "90bf257050527968655648da70bf454e39539ecd"),

    // Client autodiscovery via SRV (RFC 6186). No autoconfig/autodiscover
    // CNAMEs: mailbox.org only has certificates for its own hostnames, so a
    // CNAME under this domain would fail TLS validation in the clients.
    SRV("_autodiscover._tcp", 0, 1, 443, "auto.mailbox.org."),
    SRV("_imaps._tcp", 0, 1, 993, "imap.mailbox.org."),
    SRV("_submissions._tcp", 0, 1, 465, "smtp.mailbox.org.")
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
// p37.nexus (mail at mailbox.org)
// ---------------------------------------------------------------------------

D("p37.nexus", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(3600),
    DESEC_NS_TTL,

    // Web
    A("@", IP4_WEB),
    AAAA("@", IP6_WEB),
    A("*", IP4_WEB, TTL(10800)),

    // Mail (mailbox.org custom domain)
    MX("@", 10, "mxext1.mailbox.org."),
    MX("@", 10, "mxext2.mailbox.org."),
    MX("@", 10, "mxext3.mailbox.org."),
    MX("@", 10, "mxext4.mailbox.org."),

    // DKIM: mailbox.org holds the keys, the CNAMEs let them rotate without
    // a DNS change here. Lowercase on purpose - DNS is case-insensitive and
    // deSEC normalises anyway, so this avoids diff churn.
    CNAME("mbo0001._domainkey", "mbo0001._domainkey.mailbox.org."),
    CNAME("mbo0002._domainkey", "mbo0002._domainkey.mailbox.org."),
    CNAME("mbo0003._domainkey", "mbo0003._domainkey.mailbox.org."),
    CNAME("mbo0004._domainkey", "mbo0004._domainkey.mailbox.org."),

    // TXT
    // mailbox.org documents ~all; kept at -all since all outbound goes there.
    TXT("@", "v=spf1 include:mailbox.org -all"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@p37.nexus; ruf=mailto:dmarc@p37.nexus; fo=1; adkim=s; aspf=s; pct=100"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@p37.nexus"),

    // mailbox.org domain verification
    TXT("6ae9c48470696c7c52507e8c3ae83e0d888df6c7", "59d36b6cbc4ea9e4ea241dba6c4f7cc56e29ff27"),

    // Client autodiscovery via SRV (RFC 6186). No autoconfig/autodiscover
    // CNAMEs: mailbox.org only has certificates for its own hostnames, so a
    // CNAME under this domain would fail TLS validation in the clients.
    SRV("_autodiscover._tcp", 0, 1, 443, "auto.mailbox.org."),
    SRV("_imaps._tcp", 0, 1, 993, "imap.mailbox.org."),
    SRV("_submissions._tcp", 0, 1, 465, "smtp.mailbox.org.")
);
// ---------------------------------------------------------------------------
// pinlo.me (mail at mailbox.org)
// ---------------------------------------------------------------------------

D("pinlo.me", REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(3600),
    DESEC_NS_TTL,

    // Web
    A("@", IP4_WEB),
    AAAA("@", IP6_WEB),
    CNAME("*", "eu1.netbird.services."),

    // Mail (mailbox.org custom domain)
    MX("@", 10, "mxext1.mailbox.org."),
    MX("@", 10, "mxext2.mailbox.org."),
    MX("@", 10, "mxext3.mailbox.org."),
    MX("@", 10, "mxext4.mailbox.org."),

    // DKIM: mailbox.org holds the keys, the CNAMEs let them rotate without
    // a DNS change here. Lowercase on purpose - DNS is case-insensitive and
    // deSEC normalises anyway, so this avoids diff churn.
    CNAME("mbo0001._domainkey", "mbo0001._domainkey.mailbox.org."),
    CNAME("mbo0002._domainkey", "mbo0002._domainkey.mailbox.org."),
    CNAME("mbo0003._domainkey", "mbo0003._domainkey.mailbox.org."),
    CNAME("mbo0004._domainkey", "mbo0004._domainkey.mailbox.org."),

    // TXT
    // mailbox.org documents ~all; kept at -all since all outbound goes there.
    TXT("@", "v=spf1 include:mailbox.org -all"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@pinlo.me; ruf=mailto:dmarc@pinlo.me; fo=1; adkim=s; aspf=s; pct=100"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@pinlo.me"),

    // mailbox.org domain verification
    TXT("6ae9c48470696c7c52507e8c3ae83e0d888df6c7", "8be14aa421b4e92fcc2a4e352c30ea970d7f9bc9"),

    // Client autodiscovery via SRV (RFC 6186). No autoconfig/autodiscover
    // CNAMEs: mailbox.org only has certificates for its own hostnames, so a
    // CNAME under this domain would fail TLS validation in the clients.
    SRV("_autodiscover._tcp", 0, 1, 443, "auto.mailbox.org."),
    SRV("_imaps._tcp", 0, 1, 993, "imap.mailbox.org."),
    SRV("_submissions._tcp", 0, 1, 465, "smtp.mailbox.org.")
);

// ---------------------------------------------------------------------------
// debgen.org (mail at mailbox.org)
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

    // Mail (mailbox.org custom domain)
    MX("@", 10, "mxext1.mailbox.org."),
    MX("@", 10, "mxext2.mailbox.org."),
    MX("@", 10, "mxext3.mailbox.org."),
    MX("@", 10, "mxext4.mailbox.org."),

    // DKIM: mailbox.org holds the keys, the CNAMEs let them rotate without
    // a DNS change here. Lowercase on purpose - DNS is case-insensitive and
    // deSEC normalises anyway, so this avoids diff churn.
    CNAME("mbo0001._domainkey", "mbo0001._domainkey.mailbox.org."),
    CNAME("mbo0002._domainkey", "mbo0002._domainkey.mailbox.org."),
    CNAME("mbo0003._domainkey", "mbo0003._domainkey.mailbox.org."),
    CNAME("mbo0004._domainkey", "mbo0004._domainkey.mailbox.org."),

    // TXT
    // mailbox.org documents ~all; kept at -all since all outbound goes there.
    TXT("@", "v=spf1 include:mailbox.org -all"),
    TXT("_dmarc", "v=DMARC1; p=quarantine; rua=mailto:dmarc@debgen.org; ruf=mailto:dmarc@debgen.org; fo=1; adkim=s; aspf=s; pct=100"),
    TXT("_smtp._tls", "v=TLSRPTv1; rua=mailto:tlsrpt@debgen.org"),

    // mailbox.org domain verification
    TXT("6ae9c48470696c7c52507e8c3ae83e0d888df6c7", "9a52cfec4528232e2b2eb16b7aecb8d8dd664687"),

    // Client autodiscovery via SRV (RFC 6186). No autoconfig/autodiscover
    // CNAMEs: mailbox.org only has certificates for its own hostnames, so a
    // CNAME under this domain would fail TLS validation in the clients.
    SRV("_autodiscover._tcp", 0, 1, 443, "auto.mailbox.org."),
    SRV("_imaps._tcp", 0, 1, 993, "imap.mailbox.org."),
    SRV("_submissions._tcp", 0, 1, 465, "smtp.mailbox.org.")
);


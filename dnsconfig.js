var REG_INWX = NewRegistrar("none");
var DSP_DESEC = NewDnsProvider("desec");

var DOMAIN = "kiefer-networks.de";

var IP4_WEB  = "152.53.102.158";
var IP6_WEB  = "2a0a:4cc0:80:23ca:18b7:e0ff:fe0b:ef74";
var IP4_MAIL = "152.53.156.62";
var IP6_MAIL = "2a0a:4cc0:c2:78e1:e8dd:7eff:fe13:2b56";

D(DOMAIN, REG_INWX, DnsProvider(DSP_DESEC),
    DefaultTTL(86400),

    NAMESERVER("ns1.desec.io."),
    NAMESERVER("ns2.desec.org."),

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

    // MTA-STS Policy-Host
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

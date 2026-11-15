
import socket
import ssl
import certifi

HOSTS = [
    "ac-wwxl4wm-shard-00-00.pf1nyml.mongodb.net",
    "ac-wwxl4wm-shard-00-01.pf1nyml.mongodb.net",
    "ac-wwxl4wm-shard-00-02.pf1nyml.mongodb.net",
]

PORT = 27017

context = ssl.create_default_context(
    cafile=certifi.where()
)

for host in HOSTS:

    print("\n" + "=" * 50)
    print("HOST:", host)

    try:

        results = socket.getaddrinfo(
            host,
            PORT,
            family=socket.AF_INET,
            type=socket.SOCK_STREAM
        )

        ips = list(
            dict.fromkeys(item[4][0] for item in results)
        )

        print("IPv4 addresses:", ips)

        for ip in ips:

            try:

                raw_socket = socket.create_connection(
                    (ip, PORT),
                    timeout=10
                )

                with context.wrap_socket(
                    raw_socket,
                    server_hostname=host
                ) as tls_socket:

                    print("TLS SUCCESS")
                    print("Version:", tls_socket.version())

            except Exception as e:

                print("TLS FAILED:", repr(e))

    except Exception as e:

        print("DNS FAILED:", repr(e))

import asyncio
import random
import time
import httpx

BASE_URL = "http://localhost:8000"
CONCURRENT_USERS = 10
REQUESTS_PER_USER = 50


async def user_session(client: httpx.AsyncClient, user_id: int):
    for i in range(REQUESTS_PER_USER):
        try:
            endpoints = [
                ("GET", "/"),
                ("GET", "/usuarios/buscar"),
                ("POST", "/auth/login", {"identidad": f"user{random.randint(1,100)}", "password": "wrong"}),
                ("GET", "/usuarios/admin/buscar"),
                ("GET", "/usuarios/999999999999999999999999"),
            ]
            method, path, *body = random.choice(endpoints)
            kwargs = {"json": body[0]} if body else {}
            
            start = time.perf_counter()
            response = await client.request(method, f"{BASE_URL}{path}", **kwargs)
            latency = (time.perf_counter() - start) * 1000
            
            print(f"[U{user_id}] {method} {path} -> {response.status_code} ({latency:.1f}ms)")
            
            await asyncio.sleep(random.uniform(0.05, 0.2))
            
        except Exception as e:
            print(f"[U{user_id}] ERROR: {e}")


async def main():
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [user_session(client, i) for i in range(CONCURRENT_USERS)]
        await asyncio.gather(*tasks)
    print("Carga completada. Revisa Grafana!")


if __name__ == "__main__":
    asyncio.run(main())
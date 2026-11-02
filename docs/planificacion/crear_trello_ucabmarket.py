import json
import os
import sys
import urllib.parse
import urllib.request

KEY = os.environ.get("TRELLO_KEY")
TOKEN = os.environ.get("TRELLO_TOKEN")
if not KEY or not TOKEN:
    sys.exit("Faltan las variables TRELLO_KEY y TRELLO_TOKEN. Ver instrucciones.")

BASE = "https://api.trello.com/1"


def api(method, path, **params):
    params.update({"key": KEY, "token": TOKEN})
    data = urllib.parse.urlencode(params).encode()
    url = f"{BASE}{path}"
    if method == "GET":
        url += "?" + data.decode()
        data = None
    req = urllib.request.Request(url, data=data, method=method)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode())


EPICAS = {
    "Publicaciones": "green",
    "Usuario": "blue",
    "Chats": "purple",
    "Reseñas": "yellow",
    "Catálogo de productos": "orange",
}

LISTAS = [
    "Info del proyecto",
    "Backlog (Sprint 2)",
    "Sprint 1 - Por hacer",
    "Sprint 1 - En progreso",
    "En revisión / pruebas",
    "Hecho",
]

SPRINT_1 = [
    ("Usuario", "Crear cuenta"),
    ("Usuario", "Consultar perfil"),
    ("Publicaciones", "Añadir publicación"),
    ("Publicaciones", "Consultar publicación"),
    ("Catálogo de productos", "Visualizar catálogo de productos"),
    ("Catálogo de productos", "Búsqueda de productos"),
    ("Chats", "Crear chat"),
    ("Chats", "Añadir archivos"),
    ("Reseñas", "Añadir reseña"),
    ("Reseñas", "Consultar reseña"),
]

SPRINT_2 = [
    ("Publicaciones", "Modificar publicación"),
    ("Usuario", "Modificar perfil"),
    ("Publicaciones", "Eliminar publicación"),
    ("Catálogo de productos", "Consultar productos"),
    ("Reseñas", "Modificar reseña"),
    ("Reseñas", "Eliminar reseña"),
    ("Chats", "Reportar cuenta"),
    ("Usuario", "Auditoría perfil reporte"),
    ("Publicaciones", "Auditoría publicación reporte"),
    ("Reseñas", "Auditoría reseña reporte"),
]

INFO = [
    "Brief UcabMarket (enlace al documento)",
    "Reglas de calidad ISO/IEC 25010",
    "Restricciones del proyecto",
    "Equipo y roles",
]

board = api(
    "POST", "/boards/",
    name="UcabMarket - Brief y Sprints",
    defaultLists="false",
    defaultLabels="false",
    prefs_permissionLevel="public",
)
print("Tablero creado:", board["url"])

labels = {nombre: api("POST", f"/boards/{board['id']}/labels", name=nombre, color=color)["id"]
          for nombre, color in EPICAS.items()}

listas = {nombre: api("POST", "/lists", name=nombre, idBoard=board["id"], pos="bottom")["id"]
          for nombre in LISTAS}

for titulo in INFO:
    api("POST", "/cards", idList=listas["Info del proyecto"], name=titulo)

for epica, titulo in SPRINT_1:
    api("POST", "/cards", idList=listas["Sprint 1 - Por hacer"],
        name=f"[{epica}] {titulo}", idLabels=labels[epica])

for epica, titulo in SPRINT_2:
    api("POST", "/cards", idList=listas["Backlog (Sprint 2)"],
        name=f"[{epica}] {titulo}", idLabels=labels[epica])

print("Listo. Pega este enlace en la sección 5 del Brief:")
print(board["shortUrl"])

"""
Gera um resumo CSV a partir de um JSON exportado da extensão.

Exemplo de uso:
python scripts/generate_metrics_report.py ./dados/sessoes.json ./saida.csv
"""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path


def carregar_sessoes(caminho: Path) -> list[dict]:
    dados = json.loads(caminho.read_text(encoding="utf-8"))

    if isinstance(dados, dict) and "iaSustentavelSessions" in dados:
        sessoes = dados["iaSustentavelSessions"]
        if isinstance(sessoes, dict):
            return list(sessoes.values())

    if isinstance(dados, dict):
        return list(dados.values())

    if isinstance(dados, list):
        return dados

    raise ValueError("Formato de entrada não suportado.")


def principal() -> int:
    if len(sys.argv) != 3:
        print("Uso: python scripts/generate_metrics_report.py <entrada.json> <saida.csv>")
        return 1

    origem = Path(sys.argv[1])
    destino = Path(sys.argv[2])
    sessoes = carregar_sessoes(origem)

    destino.parent.mkdir(parents=True, exist_ok=True)

    with destino.open("w", encoding="utf-8", newline="") as saida:
        escritor = csv.DictWriter(
            saida,
            fieldnames=[
                "id",
                "dominio",
                "iniciadoEm",
                "atualizadoEm",
                "mensagensEnviadas",
                "mensagensRecebidas",
                "atividadeMs",
                "co2eGramas",
                "energiaKWh",
                "aguaLitros",
                "nivelImpacto",
            ],
        )
        escritor.writeheader()

        for sessao in sessoes:
            metricas = sessao.get("metrics", {})
            escritor.writerow(
                {
                    "id": sessao.get("id"),
                    "dominio": sessao.get("domain"),
                    "iniciadoEm": sessao.get("startedAt"),
                    "atualizadoEm": sessao.get("updatedAt"),
                    "mensagensEnviadas": sessao.get("sentMessages", 0),
                    "mensagensRecebidas": sessao.get("receivedMessages", 0),
                    "atividadeMs": sessao.get("activityMs", 0),
                    "co2eGramas": metricas.get("co2eGrams", 0),
                    "energiaKWh": metricas.get("energyKWh", 0),
                    "aguaLitros": metricas.get("waterLiters", 0),
                    "nivelImpacto": metricas.get("impactLevel", sessao.get("impactLevel", "")),
                }
            )

    print(f"Relatório gerado em: {destino}")
    return 0


if __name__ == "__main__":
    raise SystemExit(principal())

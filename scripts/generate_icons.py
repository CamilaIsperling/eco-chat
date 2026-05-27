from pathlib import Path
from PIL import Image

ORIGEM_JPG = Path(__file__).parent.parent / "images" / "logo-source.jpg"

COR_FUNDO = (215, 243, 232, 255)  # #d7f3e8


def remover_fundo_branco(imagem: Image.Image, limiar: int = 230) -> Image.Image:
    """Converte pixels quase-brancos em transparentes."""
    rgba = imagem.convert("RGBA")
    pixels = rgba.load()
    largura, altura = rgba.size

    for y in range(altura):
        for x in range(largura):
            r, g, b, a = pixels[x, y]
            if r >= limiar and g >= limiar and b >= limiar:
                pixels[x, y] = (r, g, b, 0)

    return rgba


def gerar_icone(tamanho: int, icone_sem_fundo: Image.Image) -> Image.Image:
    """Cria um ícone quadrado com círculo de fundo e o símbolo centralizado."""
    # Fundo circular transparente
    resultado = Image.new("RGBA", (tamanho, tamanho), (0, 0, 0, 0))

    # Desenha o círculo de fundo
    from PIL import ImageDraw

    draw = ImageDraw.Draw(resultado)
    margem = max(1, tamanho // 16)
    draw.ellipse(
        [margem, margem, tamanho - margem - 1, tamanho - margem - 1],
        fill=COR_FUNDO,
    )

    # Redimensiona o ícone para caber dentro do círculo (80% do tamanho)
    area_icone = int(tamanho * 0.78)
    icone_redimensionado = icone_sem_fundo.resize(
        (area_icone, area_icone), Image.LANCZOS
    )

    # Centraliza o ícone no círculo
    offset = (tamanho - area_icone) // 2
    resultado.paste(icone_redimensionado, (offset, offset), icone_redimensionado)

    return resultado


def principal():
    imagem_original = Image.open(ORIGEM_JPG)
    icone_sem_fundo = remover_fundo_branco(imagem_original)

    pasta = Path("public/icons")
    pasta.mkdir(parents=True, exist_ok=True)

    for tamanho in [16, 48, 128]:
        icone = gerar_icone(tamanho, icone_sem_fundo)
        caminho = pasta / f"icon-{tamanho}.png"
        icone.save(caminho, "PNG")
        print(f"Gerado: {caminho} ({tamanho}x{tamanho}px)")


if __name__ == "__main__":
    principal()

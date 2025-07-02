import os
from PIL import Image

input_folder = 'images'
output_folder = 'thumbnails'
target_size = (200, 200)

os.makedirs(output_folder, exist_ok=True)
image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp']

def crop_center(img):
    width, height = img.size
    min_edge = min(width, height)
    left = (width - min_edge) // 2
    top = (height - min_edge) // 2
    return img.crop((left, top, left + min_edge, top + min_edge))

for filename in os.listdir(input_folder):
    ext = os.path.splitext(filename)[1].lower()
    if ext in image_extensions:
        try:
            img_path = os.path.join(input_folder, filename)
            with Image.open(img_path) as img:
                img = img.convert("RGB")  # 确保格式统一
                img = crop_center(img)    # 中心裁剪为正方形
                img = img.resize(target_size, Image.LANCZOS)  # 高质量缩放

                output_path = os.path.join(output_folder, filename)

                if ext in ['.jpg', '.jpeg']:
                    img.save(output_path, quality=100, optimize=True, progressive=True)
                elif ext == '.png':
                    img.save(output_path, compress_level=0)
                else:
                    img.save(output_path)

                print(f"✅ 高画质缩略图已生成: {filename}")
        except Exception as e:
            print(f"❌ 错误处理 {filename}: {e}")

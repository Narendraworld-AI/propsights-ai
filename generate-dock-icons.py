import os
import subprocess
import shutil

source_icon = "/Users/admin/.gemini/antigravity/brain/1d076a6c-a303-4717-b683-81875e9a75e5/propsight_clean_icon_1786893112677.jpg"

if not os.path.exists(source_icon):
    source_icon = "/Users/admin/.gemini/antigravity/brain/1d076a6c-a303-4717-b683-81875e9a75e5/propsight_flat_icon_1786893145545.jpg"

project_dir = "/Users/admin/.gemini/antigravity-ide/scratch/propsights-ai"
public_dir = os.path.join(project_dir, "client/public")
resources_dir = os.path.join(project_dir, "resources")

os.makedirs(public_dir, exist_ok=True)
os.makedirs(resources_dir, exist_ok=True)

print(f"Using source dock icon: {source_icon}")

# First convert source jpg to a base 512x512 PNG
base_png = os.path.join(public_dir, "icon-512.png")
subprocess.run(["sips", "-s", "format", "png", "--resampleWidth", "512", source_icon, "--out", base_png], check=True)

# Generate other sizes
sizes = [
    (16, "favicon-16x16.png"),
    (32, "favicon-32x32.png"),
    (32, "favicon.png"),
    (180, "apple-touch-icon.png"),
    (192, "icon-192.png"),
    (512, "icon.png"),
    (512, "app-icon.png"),
]

for dim, fname in sizes:
    out_path = os.path.join(public_dir, fname)
    subprocess.run(["sips", "-s", "format", "png", "--resampleWidth", str(dim), base_png, "--out", out_path], check=True)
    print(f"Generated {fname} ({dim}x{dim})")

# Copy to resources
shutil.copyfile(base_png, os.path.join(resources_dir, "icon.png"))
shutil.copyfile(base_png, os.path.join(resources_dir, "splash.png"))
print("Updated resources/icon.png and resources/splash.png")

# Generate favicon.ico using sips (or multi-size png converted)
ico_path = os.path.join(public_dir, "favicon.ico")
subprocess.run(["sips", "-s", "format", "ico", "--resampleWidth", "32", base_png, "--out", ico_path], check=True)
print("Generated favicon.ico")

print("All dock icons and favicons generated successfully!")

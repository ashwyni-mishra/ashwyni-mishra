import requests
import json
import os

# Configuration
USERNAME = "ashwyni-mishra"
# We'll specifically look for these projects as they are the most robust
FEATURED_REPOS = ["Encry", "reconForge", "cybersecurity-homelab-training"]

def fetch_repo_data(repo_name):
    url = f"https://api.github.com/repos/{USERNAME}/{repo_name}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return None

def generate_svg(projects):
    svg_template = """<svg width="800" height="200" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .marquee {{
      display: flex;
      animation: scroll 40s linear infinite;
    }}
    @keyframes scroll {{
      0% {{ transform: translateX(0); }}
      100% {{ transform: translateX(-{total_width}px); }}
    }}
    .project-card {{
      fill: #0d1117;
      stroke: #30363d;
      stroke-width: 1;
    }}
    .project-title {{
      fill: #58a6ff;
      font-weight: bold;
      font-size: 18px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }}
    .project-desc {{
      fill: #8b949e;
      font-size: 14px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }}
  </style>
  <g class="marquee">
    {cards}
    <!-- Duplicate cards for seamless loop -->
    {duplicate_cards}
  </g>
</svg>"""

    card_template = """
    <g transform="translate({x}, 10)">
      <rect width="380" height="180" rx="10" class="project-card" />
      <text x="20" y="40" class="project-title">{title}</text>
      <text x="20" y="70" class="project-desc">{desc_line1}</text>
      <text x="20" y="90" class="project-desc">{desc_line2}</text>
      <text x="20" y="110" class="project-desc">{desc_line3}</text>
      <rect x="20" y="140" width="80" height="25" rx="5" fill="#23863633" stroke="#238636" stroke-width="1" />
      <text x="30" y="157" fill="#3fb950" font-size="12" font-family="sans-serif">★ {stars}</text>
      <rect x="110" y="140" width="80" height="25" rx="5" fill="#1f6feb33" stroke="#1f6feb" stroke-width="1" />
      <text x="120" y="157" fill="#58a6ff" font-size="12" font-family="sans-serif">{lang}</text>
    </g>"""

    cards_html = ""
    x_offset = 10
    card_width = 400
    
    for i, p in enumerate(projects):
        # Split description into lines (max 50 chars per line)
        desc = p.get('description', '') or 'No description available.'
        words = desc.split()
        lines = ["", "", ""]
        current_line = 0
        for word in words:
            if current_line < 3:
                if len(lines[current_line]) + len(word) < 45:
                    lines[current_line] += word + " "
                else:
                    current_line += 1
                    if current_line < 3:
                        lines[current_line] += word + " "
        
        cards_html += card_template.format(
            x=x_offset + (i * card_width),
            title=p['name'],
            desc_line1=lines[0].strip(),
            desc_line2=lines[1].strip(),
            desc_line3=lines[2].strip(),
            stars=p.get('stargazers_count', 0),
            lang=p.get('language', 'Project')
        )

    duplicate_cards = ""
    total_projects_width = len(projects) * card_width
    for i, p in enumerate(projects):
        desc = p.get('description', '') or 'No description available.'
        words = desc.split()
        lines = ["", "", ""]
        current_line = 0
        for word in words:
            if current_line < 3:
                if len(lines[current_line]) + len(word) < 45:
                    lines[current_line] += word + " "
                else:
                    current_line += 1
                    if current_line < 3:
                        lines[current_line] += word + " "

        duplicate_cards += card_template.format(
            x=x_offset + total_projects_width + (i * card_width),
            title=p['name'],
            desc_line1=lines[0].strip(),
            desc_line2=lines[1].strip(),
            desc_line3=lines[2].strip(),
            stars=p.get('stargazers_count', 0),
            lang=p.get('language', 'Project')
        )

    return svg_template.format(cards=cards_html, duplicate_cards=duplicate_cards, total_width=total_projects_width)

if __name__ == "__main__":
    projects_data = []
    for repo in FEATURED_REPOS:
        data = fetch_repo_data(repo)
        if data:
            projects_data.append(data)
    
    if projects_data:
        svg_content = generate_svg(projects_data)
        with open("projects_carousel.svg", "w", encoding="utf-8") as f:
            f.write(svg_content)
        print("Successfully updated projects_carousel.svg")

#!/usr/bin/env python3
"""Builds public/index.html from src/index.html: fills icons, the tools marquee and the curriculum."""
import pathlib
ROOT = pathlib.Path(__file__).resolve().parent
ARR = '<svg class="arr" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
TICK = '<svg class="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'
CROSS = '<svg class="tick" style="color:#FF6B6B" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>'
WA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></svg>'
PLAY = '<svg width="20" height="20" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5l7.5 4.5L3 10.5z"/></svg>'
PLAYL = '<svg width="24" height="24" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5l7.5 4.5L3 10.5z"/></svg>'
PLAYI = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg>'
CLOCK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
CERT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>'
LES = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor"/></svg>'
RES = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>'

TOOLS = [("clay","Clay"),("instantly","Instantly"),("emailbison","EmailBison"),("smartlead","Smartlead"),("prospeo","Prospeo"),("apollo","Apollo"),("claude","Claude"),("openai","ChatGPT"),("n8n","n8n"),("heyreach","HeyReach"),("apify","Apify"),("hubspot","HubSpot")]
def marq(hidden=False):
    ah = ' aria-hidden="true"' if hidden else ''
    return "".join(f'<span class="logo-item"{ah} style="align-items:center"><img src="assets/logos/{k}.png" alt="" style="width:30px;height:30px;border-radius:8px">{n}</span>' for k, n in TOOLS)

# (title, subtitle, tool logos, [lessons], [resources])
MODS = [
 ("Start here: the GTM engineer's playbook", "What the job is, the stack, and what it costs", ["clay","claude"],
  ["What a GTM engineer actually does all day", "The six machines of an outbound engine", "The stack, and a tool cost sheet for your volume", "How to use the templates in this course"], ["Tool cost sheet"]),
 ("Sending infrastructure that lands in the inbox", "Domains, mailboxes, DNS, warm-up and limits", ["instantly","emailbison"],
  ["Why you never send cold from your main domain", "Buying secondary domains and connecting mailboxes", "SPF, DKIM and DMARC, set up on screen", "Warm-up, daily limits and the Google / Outlook split", "Connecting everything to Instantly and EmailBison"], ["Deliverability checklist"]),
 ("ICP & buying signals", "Turning a vague target into a list you can filter", ["apollo"],
  ["Rewrite your ICP as signals, not adjectives", "The signals that say “now”: hiring, funding, new leaders, tool changes", "Tiering accounts by signal strength", "Finding your first 500 accounts"], ["ICP signal worksheet"]),
 ("Lead lists in Clay", "Sourcing, enrichment waterfalls and verification", ["clay","prospeo","apify"],
  ["Clay from zero: tables, columns, credits", "Sourcing from Apollo, Prospeo and Apify scrapes", "The enrichment waterfall: cheap steps before AI credits", "Email finding and verification", "Exporting a clean, tiered list"], ["Clay table templates"]),
 ("AI research agents & personalisation", "Using Claude to write first lines from real evidence", ["claude","openai"],
  ["How an AI research agent reads an account", "The prompt and the evidence fields", "Generating first lines at scale inside Clay", "Quality-checking AI output before it sends"], ["Research-agent prompt pack"]),
 ("Cold copy that gets replies", "The three-step cadence and how to test it", ["claude"],
  ["Trigger line first, one line of pain", "Days 0, 3 and 7: what each step does", "Subject lines, spintax and staying out of spam", "A/B testing by segment, not by sentence", "Teardown: real sequences that worked"], ["Copy framework + swipe file"]),
 ("Launch your campaign", "Instantly, EmailBison and Smartlead, step by step", ["instantly","emailbison","smartlead"],
  ["Building the campaign and schedule", "Mailbox rotation and sending limits", "Tracking off, plain text on: why", "Launch-day checklist and the first 72 hours", "Reading deliverability and fixing problems"], ["Launch checklist"]),
 ("AI automation for replies & hand-offs", "n8n workflows, Slack alerts, CRM and LinkedIn", ["n8n","hubspot","heyreach"],
  ["Classifying replies automatically", "n8n: alerting on Slack in minutes", "Pushing positives into your CRM", "Adding LinkedIn touches with HeyReach", "Booking the call: the hand-off that matters"], ["n8n workflow templates"]),
 ("Measure, scale & sell it", "The dashboard, what to cut, and turning it into income", ["clay"],
  ["The weekly scoreboard: what to count", "Cut, keep or double: reading the numbers", "Scaling volume without burning domains", "Offering GTM engineering as a service"], ["Dashboard template"]),
]
def modules():
    out = []
    for i, (t, s, tools, les, res) in enumerate(MODS):
        lg = "".join(f'<img src="assets/logos/{k}.png" alt="">' for k in tools)
        lis = "".join(f'<li>{LES}<span>{x}</span><em>Video</em></li>' for x in les) + "".join(f'<li class="res">{RES}<span>{x}</span><em>Template</em></li>' for x in res)
        op = " open" if i == 0 else ""
        out.append(f'<details class="mod"{op}><summary><span class="mn">MOD<b>{i:02d}</b></span><span class="mt"><b>{t}</b><small>{s} · {len(les)} lessons</small></span><span class="tg">{lg}<i class="chev"></i></span></summary><ul>{lis}</ul></details>')
    return "\n".join(out)

html = (ROOT / "index.html").read_text()
for k, v in {"{{MODULES}}": modules(), "{{MARQ}}": marq(), "{{MARQ_DUP}}": marq(True), "{{ARR}}": ARR, "{{TICK}}": TICK, "{{CROSS}}": CROSS,
             "{{WA}}": WA, "{{PLAYL}}": PLAYL, "{{PLAYI}}": PLAYI, "{{PLAY}}": PLAY, "{{CLOCK}}": CLOCK, "{{CERT}}": CERT}.items():
    html = html.replace(k, v)
assert "{{" not in html, html[html.index("{{"):html.index("{{")+40]
(ROOT.parent / "public" / "index.html").write_text(html)
print("built public/index.html", len(html))

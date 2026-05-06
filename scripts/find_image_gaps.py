from hermes_tools import terminal

r = terminal("cd /root/elviajero-comercio && grep -rn 'emoji\\|cat\\[0\\]\\|letter\\|Sin imagen\\|firstLetter\\|text-5xl.*mb-2' --include='*.tsx' app/components content/es.json 2>/dev/null | grep -v node_modules | grep -v '.specstory'", timeout=10)
print(r['output'])

from googletrans import Translator 

# 번역기
translator = Translator()

def translate(prompt):
    translation = translator.translate(prompt)
    return translation.text 

if __name__ == '__main__':
    text = input('Input : ')
    print(translate(text))
from crypt import methods
from flask import Blueprint, request
from app.models import db, Word, Wordle
import os
from ..forms.word_form import WordForm
import http.client

word_routes = Blueprint('words', __name__)

@word_routes.route('/<word>')
def get_word(word):
    word = word.lower()
    if len(word) <= 1:
        return ({'errors':['word must be more than one letter']}, 400)


    found = Word.query.filter(Word.word == word).first()

    if found:
        return {'word':word}, 200

    conn = http.client.HTTPSConnection("wordsapiv1.p.rapidapi.com")

    headers = {
        'X-RapidAPI-Key': os.environ.get("RAPIDAPI_KEY"),
        'X-RapidAPI-Host': os.environ.get("RAPIDAPI_HOST")
        }

    conn.request("GET", f"/words/{word}/frequency", headers=headers)

    res = conn.getresponse()
    data = res.read()

    decoded = data.decode("utf-8")

    if decoded.find(f'"word":') > 0:
        new_word = Word(word=word, length=len(word))
        db.session.add(new_word)
        db.session.commit()
        return ({'word':word}, 200)

    return ({'errors':['word not found']}, 400)

@word_routes.route('', methods=['POST'])
def add_word():
    form = WordForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    word = form.word.data
    if form.validate_on_submit():
        new_word = Word(word=word, length=len(word))
        db.session.add(new_word)
        db.session.commit()
        return {'word':word}, 200
    return {'errors':['Unauthorized']}, 405

@word_routes.route('/random-wordle')
def random_wordle_fetch():
    conn = http.client.HTTPSConnection("wordsapiv1.p.rapidapi.com")

    headers = {
        'X-RapidAPI-Key': os.environ.get("RAPIDAPI_KEY"),
        'X-RapidAPI-Host': os.environ.get("RAPIDAPI_HOST")
        }

    try_again=True

    while try_again:
        conn.request("GET", f"/words/?letters=5&frequencyMin=3.8&random=true", headers=headers)

        res = conn.getresponse()
        data = res.read()

        decoded = data.decode("utf-8")
        word = decoded.split('"word":"')[1][0:5]
        wordle = Wordle.query.filter(Wordle.word == word).one_or_none()
        try_again = not word.isalpha() or wordle



    new_word = Word(word=word, length=5)
    db.session.add(new_word)
    db.session.commit()
    return ({'word':word}, 200)

Number::toMoney = ->
  amount = this / 100
  
  split = "#{amount}".split('.')

  # splits groups of 3
  if split[0].length > 2
    if split[0].length > 3
      comma = split[0].length % 3
    else
      comma = 0

    after_first_pass = split[0].substr(comma).replace(/(\d{3})(?=\d)/g, "$1,")
    if comma
      split[0] = "#{split[0].substr(0, comma)}," + after_first_pass
    else
      after_first_pass

  if split[1]
    # appends zero
    if split[1].length < 2
      split[1] = "#{split[1]}0"
  else
    split[1] = "00"

  split.join('.')


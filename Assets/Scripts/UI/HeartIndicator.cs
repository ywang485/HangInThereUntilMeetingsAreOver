using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class HeartIndicator : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        _indicatorImage = gameObject.GetComponent<Image>();
        _gameManager = GameManager.GetInstance();
    }

    // Update is called once per frame
    void Update()
    {
        _indicatorImage.rectTransform.sizeDelta = new Vector2(heartUnitWidth * _gameManager.Hearts, _indicatorImage.rectTransform.rect.height);
    }

    private Image _indicatorImage;
    private GameManager _gameManager;

    public static readonly int heartUnitWidth = 16;
}
